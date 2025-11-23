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
        
        console.log("Game initialized successfully");
    },
    
    centerPlayer() {
        const gameAreaWidth = elements.gameArea.offsetWidth;
        const playerWidth = elements.player.offsetWidth;
        elements.player.style.left = `${(gameAreaWidth - playerWidth) / 2}px`;
    },
    
    startGame() {
        console.log("Starting new game");
        
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
        gameState.objects = [];
        
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
            if (gameState.animationId) {
                cancelAnimationFrame(gameState.animationId);
                gameState.animationId = null;
            }
            console.log("Game paused");
        } else {
            console.log("Game resumed");
            this.gameLoop();
        }
    },
    
    endGame() {
        console.log("Game over");
        gameState.isPlaying = false;
        if (gameState.animationId) {
            cancelAnimationFrame(gameState.animationId);
            gameState.animationId = null;
        }
        
        if (gameState.score > gameState.highScore) {
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
    
    gameLoop(timestamp) {
        if (!gameState.isPlaying || gameState.isPaused) {
            return;
        }
        
        if (!gameState.lastSpawnTime) {
            gameState.lastSpawnTime = timestamp;
        }
        
        playerMovement.update();
        
        const shouldEndGame = objectManager.updateObjects();
        
        if (timestamp - gameState.lastSpawnTime > CONFIG.spawnInterval && 
            gameState.objects.length < CONFIG.maxObjectsOnScreen) {
            objectManager.spawnObject();
            gameState.lastSpawnTime = timestamp;
        }
        
        if (shouldEndGame) {
            this.endGame();
            return;
        }
        
        gameState.animationId = requestAnimationFrame(this.gameLoop.bind(this));
    }
};