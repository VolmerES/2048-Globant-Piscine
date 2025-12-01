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

function checkGameOver() {
  if (!canMove()) {
    gameOver = true;
    setTimeout(() => {
      alert("¡Game Over! Final Score: " + score);
    }, 200);
  }
}

function checkGameState() {
  if (!gameWon && has2048()) {
    gameWon = true;
    setTimeout(() => {
      alert("¡Felicidades! Has ganado!");
    }, 200);
  }
}

function canMove() {
  // Verificar si hay celdas vacías
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return true;
    }
  }

  // Verificar si hay fusiones posibles
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j];
      if (current === 0) continue;

      // Verificar derecha e izquierda
      if (j < 3 && current === grid[i][j + 1]) return true;
      if (j > 0 && current === grid[i][j - 1]) return true;

      // Verificar arriba y abajo
      if (i < 3 && current === grid[i + 1][j]) return true;
      if (i > 0 && current === grid[i - 1][j]) return true;
    }
  }

  return false;
}