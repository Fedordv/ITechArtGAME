import { elements, gameState, CONFIG } from '../constants.js';

export const objectManager = {
    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'],
    
    spawnObject() {
        if (gameState.objects.length >= CONFIG.maxObjectsOnScreen) return;
        
        const object = document.createElement('div');
        object.className = 'falling-object';
        
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        object.style.background = this.colors[colorIndex];
        
        const size = 30 + Math.random() * 20;
        object.style.width = `${size}px`;
        object.style.height = `${size}px`;
        
        const value = Math.floor(Math.random() * 5) + 1;
        object.textContent = value;
        object.dataset.value = value;
        
        const maxLeft = elements.gameArea.offsetWidth - size;
        const startLeft = Math.random() * maxLeft;
        
        object.style.left = `${startLeft}px`;
        object.style.top = `-${size}px`;
        
        elements.gameArea.appendChild(object);
        
        gameState.objects.push({
            element: object,
            value: value,
            speed: gameState.objectSpeed,
            top: -size,
            left: startLeft,
            width: size,
            height: size,
            lastUpdateTime: performance.now() - gameState.totalPauseDuration
        });
    },
    
    updateObjects(deltaTime) {
        if (!gameState.isPlaying || gameState.isPaused) return false;
        
        let gameOver = false;
        const currentAdjustedTime = performance.now() - gameState.totalPauseDuration;
        
        for (let i = gameState.objects.length - 1; i >= 0; i--) {
            const obj = gameState.objects[i];
            
            const movement = (obj.speed * deltaTime) / 16; // Normalize to 60fps
            
            obj.top += movement;
            obj.element.style.top = `${obj.top}px`;
            obj.lastUpdateTime = currentAdjustedTime;
            
            if (this.checkCollision(obj)) {
                this.collectObject(i);
                continue;
            }
            
            if (obj.top > elements.gameArea.offsetHeight) {
                this.removeObject(i);
                gameOver = true;
                break;
            }
        }
        
        return gameOver;
    },
    
    resetObjectTimestamps(pauseDuration) {
        const currentTime = performance.now();
        gameState.objects.forEach(obj => {
            obj.lastUpdateTime = currentTime - pauseDuration;
        });
    },
    
    checkCollision(obj) {
        const playerRect = elements.player.getBoundingClientRect();
        const objRect = obj.element.getBoundingClientRect();
        const gameAreaRect = elements.gameArea.getBoundingClientRect();
        
        const relativePlayerRect = {
            left: playerRect.left - gameAreaRect.left,
            right: playerRect.right - gameAreaRect.left,
            top: playerRect.top - gameAreaRect.top,
            bottom: playerRect.bottom - gameAreaRect.top
        };
        
        const relativeObjRect = {
            left: objRect.left - gameAreaRect.left,
            right: objRect.right - gameAreaRect.left,
            top: objRect.top - gameAreaRect.top,
            bottom: objRect.bottom - gameAreaRect.top
        };
        
        const collision = 
            relativePlayerRect.left < relativeObjRect.right - 2 &&
            relativePlayerRect.right > relativeObjRect.left + 2 &&
            relativePlayerRect.top < relativeObjRect.bottom - 2 &&
            relativePlayerRect.bottom > relativeObjRect.top + 2;
            
        return collision;
    },
    
    collectObject(index) {
        const obj = gameState.objects[index];
        
        if (obj.value > 0 && obj.value <= 5) {
            gameState.score += obj.value;
            elements.score.textContent = gameState.score;
        }
        
        this.removeObject(index);
        
        if (gameState.score >= gameState.level * CONFIG.levelUpScore && 
            gameState.level < CONFIG.maxLevel) {
            gameState.level++;
            gameState.objectSpeed += CONFIG.objectSpeedIncrement;
            elements.level.textContent = gameState.level;
            
            gameState.objects.forEach(obj => {
                obj.speed = gameState.objectSpeed;
            });
        }
    },
    
    removeObject(index) {
        if (gameState.objects[index] && gameState.objects[index].element.parentNode) {
            gameState.objects[index].element.remove();
        }
        if (index >= 0 && index < gameState.objects.length) {
            gameState.objects.splice(index, 1);
        }
    },
    
    clearAllObjects() {
        const fallingObjects = elements.gameArea.querySelectorAll('.falling-object');
        fallingObjects.forEach(obj => {
            if (obj.parentNode) {
                obj.remove();
            }
        });
        
        gameState.objects.length = 0;
    }
};