function initGame() {
  grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  score = 0;
  updateScore();
  addRandomTile();
  addRandomTile();
  updateBoard();
}

// Event listeners
const restartButton = document.getElementById("restart-btn");
if (restartButton) {
  restartButton.addEventListener("click", function () {
    initGame();
  });
}

// Iniciar el juego al cargar la página
window.onload = function() {
  initGame();
};