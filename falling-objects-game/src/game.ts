import { Player } from "./player";
import { FallingObject } from "./object";

export class Game {
    gameArea: HTMLElement;
    score: number = 0;
    player: Player;
    objects: FallingObject[] = [];
    spawnInterval: number = 2;

    constructor(gameArea: HTMLElement) {
       this.gameArea = gameArea;
       this.player = new Player(gameArea);
       this.spawnObjects();
       requestAnimationFrame(this.gameLoop.bind(this));
    }

    spawnObjects() {
    setInterval(() => {
      const obj = new FallingObject(this.gameArea);
      this.objects.push(obj);
    }, this.spawnInterval);
  }

  gameLoop() {
    this.objects.forEach((obj, i) => {
      obj.fall();
      if (obj.isOutOfGameArea()) {
        obj.remove();
        this.objects.splice(i, 1);
      }
      // Здесь позже добавим проверку столкновения с игроком
    });

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}