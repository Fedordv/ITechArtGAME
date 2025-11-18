import { elements, gameState, CONFIG } from '../constants.js';
import { playerMovement } from './playerMovement.js';
import { objectManager } from './objectManager.js';

export const gameManager = {
    init() {
        playerMovement.init();
        
        elements.highScore.textContent = gameState.highScore;
        
        elements.startButton.addEventListener('click', () => {
            this.startGame();
        });
        
        elements.pauseButton.addEventListener('click', () => {
            this.togglePause();
        });
        
        elements.restartButton.addEventListener('click', () => {
            this.restartGame();
        });
        
        this.centerPlayer();
    },
    
    centerPlayer() {
        const gameAreaWidth = elements.gameArea.offsetWidth;
        const playerWidth = elements.player.offsetWidth;
        elements.player.style.left = `${(gameAreaWidth - playerWidth) / 2}px`;
    },
    
    startGame() {
        if (gameState.isPlaying) return;
        
        if (gameState.animationId) {
            cancelAnimationFrame(gameState.animationId);
            gameState.animationId = null;
        }
        
        gameState.isPlaying = true;
        gameState.isPaused = false;
        gameState.score = 0;
        gameState.level = 1;
        gameState.objectSpeed = CONFIG.initialObjectSpeed;
        gameState.lastSpawnTime = 0;
        gameState.lastFrameTime = 0;
        
        elements.score.textContent = '0';
        elements.level.textContent = '1';
        elements.gameOver.classList.add('hidden');
        elements.pauseButton.textContent = 'Pause';
        
        objectManager.clearAllObjects();
        
        this.centerPlayer();
        
        this.gameLoop();
    },
    
    togglePause() {
        if (!gameState.isPlaying) return;
        
        gameState.isPaused = !gameState.isPaused;
        elements.pauseButton.textContent = gameState.isPaused ? 'Resume' : 'Pause';
        
        if (!gameState.isPaused) {
            this.gameLoop();
        } else if (gameState.animationId) {
            cancelAnimationFrame(gameState.animationId);
            gameState.animationId = null;
        }
    },
    
    endGame() {
        gameState.isPlaying = false;
        if (gameState.animationId) {
            cancelAnimationFrame(gameState.animationId);
            gameState.animationId = null;
        }
        
        if (gameState.score > gameState.highScore && gameState.score < 1000000) { // Reasonable upper limit
            gameState.highScore = gameState.score;
            localStorage.setItem('fallingObjectsHighScore', gameState.highScore.toString());
            elements.highScore.textContent = gameState.highScore;
        }
        
        elements.finalScore.textContent = gameState.score;
        elements.gameOver.classList.remove('hidden');
    },
    
    restartGame() {
        this.startGame();
    },
    
    gameLoop(currentTime) {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        const deltaTime = gameState.lastFrameTime ? currentTime - gameState.lastFrameTime : 16; // ~60fps
        gameState.lastFrameTime = currentTime;
        
        if (!gameState.lastSpawnTime) {
            gameState.lastSpawnTime = currentTime;
        }
        
        playerMovement.update();
        
        const shouldEndGame = objectManager.updateObjects(deltaTime);
        
        if (currentTime - gameState.lastSpawnTime > CONFIG.spawnInterval && 
            gameState.objects.length < CONFIG.maxObjectsOnScreen) {
            objectManager.spawnObject();
            gameState.lastSpawnTime = currentTime;
        }
        
        if (shouldEndGame) {
            this.endGame();
            return;
        }
        
        gameState.animationId = requestAnimationFrame(this.gameLoop.bind(this));
    }
};