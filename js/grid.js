let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

let score = 0;

function addRandomTile() {
  let emptyCells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { x, y } = emptyCells[randomIndex];

  grid[x][y] = Math.random() < 0.9 ? 2 : 4;
  return { x, y };
}

function getColumn(grid, colIndex) {
  const column = [];
  for (let row = 0; row < 4; row++) {
    column.push(grid[row][colIndex]);
  }
  return column;
}

function setColumn(grid, colIndex, column) {
  for (let row = 0; row < 4; row++) {
    grid[row][colIndex] = column[row];
  }
}

function updateBoard() {
  const boardContainer = document.getElementById("grid");

  // Si es la primera vez, crea los tiles y les pone id
  if (boardContainer.children.length === 0) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = `tile-${i}-${j}`;
        boardContainer.appendChild(tile);
      }
    }
  }

  // Solo actualiza clases y contenido
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = grid[i][j];
      const tile = document.getElementById(`tile-${i}-${j}`);
      tile.className = "tile";
      tile.classList.add("tile-" + value);
      tile.textContent = value !== 0 ? value : "";
    }
  }
}

function updateScore() {
  document.getElementById("score").textContent = score;
}