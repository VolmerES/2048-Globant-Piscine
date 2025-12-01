let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

let score = 0;
let tileIdCounter = 0;
let tileGrid = []; // Grid paralelo que guarda IDs de fichas

function initTileGrid() {
  tileGrid = [];
  for (let i = 0; i < 4; i++) {
    tileGrid[i] = [];
    for (let j = 0; j < 4; j++) {
      tileGrid[i][j] = null;
    }
  }
}

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
  tileGrid[x][y] = tileIdCounter++;
  
  return { x, y };
}

function getColumn(grid, colIndex) {
  const column = [];
  for (let row = 0; row < 4; row++) {
    column.push(grid[row][colIndex]);
  }
  return column;
}

function getTileColumn(colIndex) {
  const column = [];
  for (let row = 0; row < 4; row++) {
    column.push(tileGrid[row][colIndex]);
  }
  return column;
}

function setColumn(grid, colIndex, column) {
  for (let row = 0; row < 4; row++) {
    grid[row][colIndex] = column[row];
  }
}

function setTileColumn(colIndex, column) {
  for (let row = 0; row < 4; row++) {
    tileGrid[row][colIndex] = column[row];
  }
}