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
        gameState.pauseStartTime = 0;
        gameState.totalPauseDuration = 0;
        
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
        
        if (gameState.isPaused) {
            gameState.pauseStartTime = performance.now();
            if (gameState.animationId) {
                cancelAnimationFrame(gameState.animationId);
                gameState.animationId = null;
            }
        } else {
            const pauseEndTime = performance.now();
            const pauseDuration = pauseEndTime - gameState.pauseStartTime;
            gameState.totalPauseDuration += pauseDuration;
            
            objectManager.resetObjectTimestamps(pauseDuration);
            
            gameState.lastSpawnTime += pauseDuration;
            
            this.gameLoop();
        }
    },
    
    endGame() {
        gameState.isPlaying = false;
        if (gameState.animationId) {
            cancelAnimationFrame(gameState.animationId);
            gameState.animationId = null;
        }
        
        if (gameState.score > gameState.highScore && gameState.score < 1000000) {
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
        
        const adjustedTime = currentTime - gameState.totalPauseDuration;
        
        const deltaTime = gameState.lastFrameTime ? adjustedTime - gameState.lastFrameTime : 16;
        gameState.lastFrameTime = adjustedTime;
        
        if (!gameState.lastSpawnTime) {
            gameState.lastSpawnTime = adjustedTime;
        }
        
        playerMovement.update();
        
        const shouldEndGame = objectManager.updateObjects(deltaTime);
        
        if (adjustedTime - gameState.lastSpawnTime > CONFIG.spawnInterval && 
            gameState.objects.length < CONFIG.maxObjectsOnScreen) {
            objectManager.spawnObject();
            gameState.lastSpawnTime = adjustedTime;
        }
        
        if (shouldEndGame) {
            this.endGame();
            return;
        }
        
        gameState.animationId = requestAnimationFrame(this.gameLoop.bind(this));
    }
};