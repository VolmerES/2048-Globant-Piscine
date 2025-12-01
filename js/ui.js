function updateScore() {
  document.getElementById("score").textContent = score;
}

function renderTiles(newTilePos = null) {
  const boardContainer = document.getElementById("grid");
  
  // Primera vez: crear celdas de fondo
  if (boardContainer.querySelectorAll('.tile-background').length === 0) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement("div");
        cell.className = "tile-background";
        cell.style.transform = `translate(${j * 95}px, ${i * 95}px)`;
        boardContainer.appendChild(cell);
      }
    }
  }

  // Recrear todas las fichas en cada renderizado
  // Esto es más simple y evita bugs de asignación incorrecta
  const tiles = boardContainer.querySelectorAll('.tile[data-pos]');
  tiles.forEach(tile => tile.remove());

  const isNewTile = (i, j) => newTilePos && newTilePos.x === i && newTilePos.y === j;

  // Renderizar todas las fichas del grid actual
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = grid[i][j];
      if (value === 0) continue;

      const key = `${i}-${j}`;
      const tile = document.createElement("div");
      tile.dataset.pos = key;
      tile.style.zIndex = 10;
      tile.style.transform = `translate(${j * 95}px, ${i * 95}px)`;
      tile.textContent = value;

      if (isNewTile(i, j)) {
        // Nueva ficha con animación pop
        tile.className = "tile tile-" + value + " tile-new";
        tile.style.setProperty('--tx', `${j * 95}px`);
        tile.style.setProperty('--ty', `${i * 95}px`);
        setTimeout(() => tile.classList.remove('tile-new'), 200);
      } else {
        // Ficha normal
        tile.className = "tile tile-" + value;
      }

      boardContainer.appendChild(tile);
    }
  }
}