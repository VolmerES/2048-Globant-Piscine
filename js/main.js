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
  updateBoard();
}

function has2048() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 2048) {
        return true;
      }
    }
  }
  return false;
}

function checkGameState() {
  if (!gameWon && has2048()) {
    gameWon = true;
    setTimeout(() => {
      alert("¡Felicidades! Has ganado!");
    }, 200);
  }
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