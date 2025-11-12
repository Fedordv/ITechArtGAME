export class FallingObject {
  element: HTMLElement;
  x: number;
  y: number = 0;
  speed: number = 2;
  gameArea: HTMLElement;

  constructor(gameArea: HTMLElement) {
    this.gameArea = gameArea;
    this.x = Math.random() * (gameArea.clientWidth - 20);
    this.element = document.createElement("div");
    this.element.className = "falling-object";
    gameArea.appendChild(this.element);
    this.updatePosition();
  }

  fall() {
    this.y += this.speed;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.x}`
    this.element.style.top = `${this.y}`
  }

  isOutOfGameArea() {
    return this.y > this.gameArea.clientHeight;
  }

  remove() {
    this.gameArea.removeChild(this.element)
  }

  getBounds() {
    return this.element.getBoundingClientRect();
  }
}