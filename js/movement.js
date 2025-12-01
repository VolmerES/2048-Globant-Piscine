/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movement.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: volmer <volmer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/01 15:57:28 by volmer            #+#    #+#             */
/*   Updated: 2025/12/01 16:26:39 by volmer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ------------------------------------------ */
/*               MOVIMIENTO                   */
/* ------------------------------------------ */

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
	checkGameState();
	checkGameOver();
  }
});

/* ------------------------------------------ */
/*  MOVIMIENTO HACIA ARRIBA                   */
/* ------------------------------------------ */

function moveUp() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    const oldColumn = getColumn(grid, col);
    let newColumn = compressRow(oldColumn);
    newColumn = mergeRow(newColumn);
    newColumn = compressRow(newColumn);
    setColumn(grid, col, newColumn);
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
/*        MOVIMIENTO HACIA ABAJO              */
/* ------------------------------------------ */

function moveDown() {
  	let moved = false;

	for (let col = 0; col < 4; col++) {
    const oldColumn = getColumn(grid, col);
    let newColumn = reverseRow(oldColumn);
    newColumn = compressRow(newColumn);
    newColumn = mergeRow(newColumn);
    newColumn = compressRow(newColumn);
    newColumn = reverseRow(newColumn);
    setColumn(grid, col, newColumn);

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
/*     MOVIMIENTO HACIA LA DERECHA            */
/* ------------------------------------------ */

function moveRight() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    const oldRow = [...grid[row]];
    let newRow = reverseRow(grid[row]);
    newRow = compressRow(newRow);
    newRow = mergeRow(newRow);
    newRow = compressRow(newRow);
    newRow = reverseRow(newRow);
    grid[row] = newRow;
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

/* ------------------------------------------ */
/*     MOVIMIENTO HACIA LA IZQUIERDA          */
/* ------------------------------------------ */

function moveLeft() {
	
  let moved = false;

  for (let row = 0; row < 4; row++) {
    const oldRow = [...grid[row]];
    let newRow = compressRow(grid[row]);
    newRow = mergeRow(newRow);
    newRow = compressRow(newRow);
    grid[row] = newRow;
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

/* ------------------------------------------ */
/*               AUXILIARES                   */
/* ------------------------------------------ */

function reverseRow(row) {
  return [...row].reverse();
}

function compressRow(row) {
  const filtered = row.filter((value) => value !== 0);
  while (filtered.length < 4) {
    filtered.push(0);
  }
  return filtered;
}

function mergeRow(row) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] = row[i] * 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  return row;
}