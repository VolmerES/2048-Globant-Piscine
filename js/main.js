let gameOver = false;
let gameWon = false;

function initGame() {
  grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  score = 0;
  gameOver = false;
  gameWon = false;
  updateScore();
  addRandomTile();
  addRandomTile();
  renderTiles();
}

const restartButton = document.getElementById("restart-btn");
if (restartButton) {
  restartButton.addEventListener("click", function () {
    initGame();
  });
}


window.onload = function() {
  initGame();
};