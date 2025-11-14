import { elements } from './domElements.js';
import { gameState } from './gameState.js';
import { CONFIG } from './config.js';

export const objectManager = {
    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'],
    
    spawnObject() {
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
            height: size
        });
    },
    
    updateObjects() {
        if (!gameState.isPlaying || gameState.isPaused) return false;
        
        let gameOver = false;
        
        for (let i = gameState.objects.length - 1; i >= 0; i--) {
            const obj = gameState.objects[i];
            
            obj.top += obj.speed;
            obj.element.style.top = `${obj.top}px`;
            
            if (this.checkCollision(obj)) {
                this.collectObject(i);
                continue;
            }
            
            if (obj.top > elements.gameArea.offsetHeight) {
                console.log("Object missed! Game over!");
                this.removeObject(i);
                gameOver = true;
                break;
            }
        }
        
        return gameOver;
    },
    
    checkCollision(obj) {
        const playerLeft = parseInt(elements.player.style.left) || 0;
        const playerTop = elements.gameArea.offsetHeight - elements.player.offsetHeight - 10;
        
        const objLeft = obj.left;
        const objTop = obj.top;
        const objRight = objLeft + obj.width;
        const objBottom = objTop + obj.height;
        
        const playerRight = playerLeft + elements.player.offsetWidth;
        const playerBottom = playerTop + elements.player.offsetHeight;
        
        const collision = 
            objLeft < playerRight &&
            objRight > playerLeft &&
            objTop < playerBottom &&
            objBottom > playerTop;
            
        return collision;
    },
    
    collectObject(index) {
        const obj = gameState.objects[index];
        gameState.score += obj.value;
        elements.score.textContent = gameState.score;
        
        this.removeObject(index);
        
        if (gameState.score >= gameState.level * CONFIG.levelUpScore && gameState.level < CONFIG.maxLevel) {
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
        gameState.objects.splice(index, 1);
    },
    
    clearAllObjects() {
        const fallingObjects = elements.gameArea.querySelectorAll('.falling-object');
        fallingObjects.forEach(obj => {
            if (obj.parentNode) {
                obj.remove();
            }
        });
        
       
        gameState.objects = [];
    }
};