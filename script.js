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
            tile.classList.add("tile-" + value); // siempre añade la clase
            
            if (value !== 0) {
                tile.textContent = value;
            }
            
            boardContainer.appendChild(tile);
        }
    }
}


//teclas

document.addEventListener("keydown", function (event) {
  let moved = false;

  if (event.key === "ArrowLeft") {
    console.log("Movimiento: izquierda");
    moved = moveLeft();
  } else if (event.key === "ArrowRight") {
    console.log("Movimiento: derecha");
    moved = moveRight();
  } else if (event.key === "ArrowUp") {
    console.log("Movimiento: arriba");
    moved = moveUp();
  } else if (event.key === "ArrowDown") {
    console.log("Movimiento: abajo");
    moved = moveDown();
  }

  if (moved) {
    addRandomTile();
    updateBoard();
  }
});

//boton de reinicio
const restartButton = document.getElementById("restart-btn");
if (restartButton) {
  restartButton.addEventListener("click", function () {
    initGame();
  });
}

//auxilar para filas

function compressRow(row) {
  const filtered = row.filter((value) => value !== 0); // quitamos ceros
  while (filtered.length < 4) {
    filtered.push(0); // añadimos ceros al final hasta tener 4 elementos
  }
  return filtered;
}

function mergeRow(row) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] = row[i] * 2;   // fusionamos (2+2 -> 4, 4+4 -> 8, etc.)
      row[i + 1] = 0;        // la ficha de la derecha se "consume"
      score += row[i];       // sumamos al marcador el valor resultante
    }
  }
  return row;
}

//moveleft

/* ------------------------------------------ */
/*  7. MOVIMIENTO HACIA LA IZQUIERDA          */
/* ------------------------------------------ */

function moveLeft() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    // Copia de la fila original para saber si luego ha cambiado
    const oldRow = [...grid[row]];

    // 1) Comprimir (quitar ceros)
    let newRow = compressRow(grid[row]);

    // 2) Fusionar
    newRow = mergeRow(newRow);

    // 3) Volver a comprimir después de fusionar
    newRow = compressRow(newRow);

    // 4) Guardar la nueva fila en el grid
    grid[row] = newRow;

    // 5) Comprobar si esta fila ha cambiado respecto a la original
    for (let col = 0; col < 4; col++) {
      if (oldRow[col] !== newRow[col]) {
        moved = true;
        break;
      }
    }
  }

  // Actualizamos el marcador en la interfaz
  document.getElementById("score").textContent = score;

  // Devolvemos si se ha movido algo en todo el tablero
  return moved;
}

//movimiento derecha para no repetir codigo
function reverseRow(row) {
  return [...row].reverse();
}

// move right
function moveRight() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    const oldRow = [...grid[row]];

    // 1) Invertimos la fila
    let newRow = reverseRow(grid[row]);

    // 2) Usamos la misma lógica que moveLeft
    newRow = compressRow(newRow);
    newRow = mergeRow(newRow);
    newRow = compressRow(newRow);

    // 3) Volvemos a invertir
    newRow = reverseRow(newRow);

    // 4) Guardamos en el grid
    grid[row] = newRow;

    // 5) Comprobamos si hubo movimiento
    for (let col = 0; col < 4; col++) {
      if (oldRow[col] !== newRow[col]) {
        moved = true;
        break;
      }
    }
  }

  document.getElementById("score").textContent = score;
  return moved;
}

//move up
/* ------------------------------------------ */
/*  FUNCIONES AUXILIARES PARA COLUMNAS        */
/* ------------------------------------------ */

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
/* ------------------------------------------ */
/*  MOVIMIENTO HACIA ARRIBA                   */
/* ------------------------------------------ */

function moveUp() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    const oldColumn = getColumn(grid, col);

    // 1) Comprimir (quitar ceros)
    let newColumn = compressRow(oldColumn);

    // 2) Fusionar
    newColumn = mergeRow(newColumn);

    // 3) Volver a comprimir
    newColumn = compressRow(newColumn);

    // 4) Guardar en el grid
    setColumn(grid, col, newColumn);

    // 5) Mirar si cambió algo
    for (let row = 0; row < 4; row++) {
      if (oldColumn[row] !== newColumn[row]) {
        moved = true;
        break;
      }
    }
  }

  

  document.getElementById("score").textContent = score;
  return moved;
}

/* ------------------------------------------ */
/*  MOVIMIENTO HACIA ABAJO                    */
/* ------------------------------------------ */

function moveDown() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    const oldColumn = getColumn(grid, col);

    // 1) Invertimos la columna (como hacíamos con filas en moveRight)
    let newColumn = reverseRow(oldColumn);

    // 2) Reutilizamos la lógica de arriba (como si fuera "arriba" en invertido)
    newColumn = compressRow(newColumn);
    newColumn = mergeRow(newColumn);
    newColumn = compressRow(newColumn);

    // 3) Volvemos a invertir para dejarla en su orientación normal
    newColumn = reverseRow(newColumn);

    // 4) Guardamos en el grid
    setColumn(grid, col, newColumn);

    // 5) Comprobamos si cambió algo
    for (let row = 0; row < 4; row++) {
      if (oldColumn[row] !== newColumn[row]) {
        moved = true;
        break;
      }
    }
  }

  document.getElementById("score").textContent = score;
  return moved;
}





//iniciar el juego al cargar la pagina

window.onload = function() {
	initGame();
};
