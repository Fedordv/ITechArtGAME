import { Game } from "./game";

window.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById('gameArea')!;
    new Game(gameArea)
}) 