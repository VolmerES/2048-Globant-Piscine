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

async function checkGameOver() {
	if (gameOver) return;

	if (!canMove()) {
		gameOver = true;
		setTimeout(async () => {
			// Verificar si la puntuación es top 10
			const isTop10 = await leaderboardManager.isTopScore(score);

			if (isTop10 && score > 0) {
				// Mostrar modal para guardar puntuación
				const saved = await leaderboardUI.showSaveScoreModal(score);

				if (saved) {
					// Mostrar leaderboard después de guardar
					await leaderboardUI.open();
				} else {
					alert("¡Game Over! Final Score: " + score);
				}
			} else {
				alert("¡Game Over! Final Score: " + score);
			}
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