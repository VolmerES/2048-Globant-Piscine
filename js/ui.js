function updateBoard() {
  const boardContainer = document.getElementById("grid");
  boardContainer.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = grid[i][j];
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.classList.add("tile-" + value);
      
      if (value !== 0) {
        tile.textContent = value;
      }
      
      boardContainer.appendChild(tile);
    }
  }
}

function updateScore() {
  document.getElementById("score").textContent = score;
}