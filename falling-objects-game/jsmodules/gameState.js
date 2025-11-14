import { CONFIG } from './config.js';

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