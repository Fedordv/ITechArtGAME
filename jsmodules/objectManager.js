import { elements, gameState, CONFIG } from '../constants.js';

// Object Management
export const objectManager = {
    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'],
    
    spawnObject() {
        // Limit maximum objects on screen
        if (gameState.objects.length >= CONFIG.maxObjectsOnScreen) {
            return;
        }
        
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
        
        console.log(`Spawned object, total: ${gameState.objects.length}`);
    },
    
    updateObjects() {
        if (!gameState.isPlaying || gameState.isPaused) {
            return false;
        }
        
        let gameOver = false;
        
        for (let i = gameState.objects.length - 1; i >= 0; i--) {
            const obj = gameState.objects[i];
            
            // Update object position
            obj.top += obj.speed;
            obj.element.style.top = `${obj.top}px`;
            
            // Check collision
            if (this.checkCollision(obj)) {
                this.collectObject(i);
                continue;
            }
            
            // Check if object is out of bounds
            if (obj.top > elements.gameArea.offsetHeight) {
                console.log("Object missed - game over");
                this.removeObject(i);
                gameOver = true;
                break;
            }
        }
        
        return gameOver;
    },
    
    checkCollision(obj) {
        const playerRect = elements.player.getBoundingClientRect();
        const objRect = obj.element.getBoundingClientRect();
        
        // Simple and reliable collision detection
        const collision = 
            playerRect.left < objRect.right &&
            playerRect.right > objRect.left &&
            playerRect.top < objRect.bottom &&
            playerRect.bottom > objRect.top;
            
        return collision;
    },
    
    collectObject(index) {
        const obj = gameState.objects[index];
        gameState.score += obj.value;
        elements.score.textContent = gameState.score;
        
        console.log(`Object collected, score: ${gameState.score}`);
        
        this.removeObject(index);
        
        // Check for level up
        if (gameState.score >= gameState.level * CONFIG.levelUpScore && 
            gameState.level < CONFIG.maxLevel) {
            gameState.level++;
            gameState.objectSpeed += CONFIG.objectSpeedIncrement;
            elements.level.textContent = gameState.level;
            
            // Update speed for all existing objects
            gameState.objects.forEach(obj => {
                obj.speed = gameState.objectSpeed;
            });
            
            console.log(`Level up: ${gameState.level}, speed: ${gameState.objectSpeed}`);
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
        // Remove all objects from DOM
        const fallingObjects = elements.gameArea.querySelectorAll('.falling-object');
        fallingObjects.forEach(obj => {
            obj.remove();
        });
        
        // Clear the objects array
        gameState.objects = [];
        
        console.log("All objects cleared");
    }
};