import { elements, gameState, CONFIG, KEYS } from '../constants.js';

// Player Movement
export const playerMovement = {
    keys: {
        left: false,
        right: false
    },
    
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === KEYS.ARROW_LEFT) this.keys.left = true;
            if (e.key === KEYS.ARROW_RIGHT) this.keys.right = true;
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === KEYS.ARROW_LEFT) this.keys.left = false;
            if (e.key === KEYS.ARROW_RIGHT) this.keys.right = false;
        });
    },
    
    update() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        // Get current position
        let currentLeft = parseInt(elements.player.style.left) || 0;
        const gameAreaWidth = elements.gameArea.offsetWidth;
        const playerWidth = elements.player.offsetWidth;
        
        // Move player
        if (this.keys.left) {
            currentLeft = Math.max(0, currentLeft - CONFIG.playerSpeed);
        }
        
        if (this.keys.right) {
            currentLeft = Math.min(gameAreaWidth - playerWidth, currentLeft + CONFIG.playerSpeed);
        }
        
        elements.player.style.left = `${currentLeft}px`;
    }
};