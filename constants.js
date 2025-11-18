// Game Configuration
export const CONFIG = {
    playerSpeed: 8,
    initialObjectSpeed: 2,
    objectSpeedIncrement: 0.2,
    spawnInterval: 1000,
    levelUpScore: 10,
    maxLevel: 10,
    maxObjectsOnScreen: 8
};

// DOM Elements
export const elements = {
    player: document.getElementById('player'),
    gameArea: document.querySelector('.game-area'),
    score: document.getElementById('score'),
    highScore: document.getElementById('high-score'),
    level: document.getElementById('level'),
    startButton: document.getElementById('start-button'),
    pauseButton: document.getElementById('pause-button'),
    gameOver: document.getElementById('game-over'),
    finalScore: document.getElementById('final-score'),
    restartButton: document.getElementById('restart-button')
};

// Key constants
export const KEYS = {
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight'
};

// Game State
export const gameState = {
    score: 0,
    highScore: parseInt(localStorage.getItem('fallingObjectsHighScore')) || 0,
    level: 1,
    isPlaying: false,
    isPaused: false,
    animationId: null,
    objects: [],
    lastSpawnTime: 0,
    objectSpeed: CONFIG.initialObjectSpeed
};