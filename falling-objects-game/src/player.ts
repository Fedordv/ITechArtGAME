export class Player {
  element: HTMLElement;
  x: number;
  y: number;
  width: number = 50;
  height: number = 20;
  speed: number = 5;
  gameArea: HTMLElement;

  constructor (gameArea: HTMLElement) {
    this.gameArea = gameArea;
    this.element = document.createElement('div');
    this.element.id = "player";
    gameArea.appendChild(this.element)
    this.x = gameArea.clientHeight /2 - this.width /2; 
    this.y = gameArea.clientHeight - this.height - 10;
    this.updatePosition();

    window.addEventListener("keydown", this.move.bind(this));
    }

    move(event: KeyboardEvent) {
        if(event.key === 'AllowLeft') this.x -= this.speed
        if(event.key === 'AllowRight') this.x += this.speed

        this.x = Math.max(0, Math.min(this.x, this.gameArea.clientWidth - this.width));
        this.updatePosition();
    }

    updatePosition(){
        this.element.style.left = `${this.x}`
        this.element.style.top = `${this.y}`
    }

    getBounds(){
        return this.element.getBoundingClientRect();
    }
}