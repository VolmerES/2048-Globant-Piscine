//definir talblero


let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

let score = 0;

//funcion para iniciar el juego

function initGame() {
	grid = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
	];

	score = 0;

	document.getElementById("score").textContent = score;

	addRandomTile();
	addRandomTile();

	updateBoard();
}

//añadir fichas

function addRandomTile() 
{
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
}


//dibujar el tablero

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

//iniciar el juego al cargar la pagina

window.onload = function() {
	initGame();
};
