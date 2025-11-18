import { elements, gameState, CONFIG } from '../constants.js';
import { playerMovement } from './playerMovement.js';
import { objectManager } from './objectManager.js';

// Game Management
export const gameManager = {
    init() {
        playerMovement.init();
        
        // Initialize high score display
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
        
        // Center player initially
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
        
        // Stop any existing animation
        if (gameState.animationId) {
            cancelAnimationFrame(gameState.animationId);
            gameState.animationId = null;
        }
        
        // Reset game state
        gameState.isPlaying = true;
        gameState.isPaused = false;
        gameState.score = 0;
        gameState.level = 1;
        gameState.objectSpeed = CONFIG.initialObjectSpeed;
        gameState.lastSpawnTime = 0;
        gameState.objects = [];
        
        // Reset UI
        elements.score.textContent = '0';
        elements.level.textContent = '1';
        elements.gameOver.classList.add('hidden');
        elements.pauseButton.textContent = 'Pause';
        
        // Clear any existing objects
        objectManager.clearAllObjects();
        
        // Center player
        this.centerPlayer();
        
        // Start game loop
        this.gameLoop();
    },
    
    togglePause() {
        if (!gameState.isPlaying) return;
        
        gameState.isPaused = !gameState.isPaused;
        elements.pauseButton.textContent = gameState.isPaused ? 'Resume' : 'Pause';
        
        if (gameState.isPaused) {
            // Pause the game
            if (gameState.animationId) {
                cancelAnimationFrame(gameState.animationId);
                gameState.animationId = null;
            }
            console.log("Game paused");
        } else {
            // Resume the game
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
        
        // Update high score
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
        // Check if game should be running
        if (!gameState.isPlaying || gameState.isPaused) {
            return;
        }
        
        // Initialize lastSpawnTime if not set
        if (!gameState.lastSpawnTime) {
            gameState.lastSpawnTime = timestamp;
        }
        
        // Update player
        playerMovement.update();
        
        // Update objects
        const shouldEndGame = objectManager.updateObjects();
        
        // Spawn new objects
        if (timestamp - gameState.lastSpawnTime > CONFIG.spawnInterval && 
            gameState.objects.length < CONFIG.maxObjectsOnScreen) {
            objectManager.spawnObject();
            gameState.lastSpawnTime = timestamp;
        }
        
        // Check for game over
        if (shouldEndGame) {
            this.endGame();
            return;
        }
        
        // Continue game loop
        gameState.animationId = requestAnimationFrame(this.gameLoop.bind(this));
    }
};