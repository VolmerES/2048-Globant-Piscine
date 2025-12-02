let gameOver = false;
let gameWon = false;

function initGame() {
	// Limpiar overlays si existen
	const overlays = document.querySelectorAll('.game-over-overlay');
	overlays.forEach(overlay => overlay.remove());

	grid = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];

	score = 0;
	gameOver = false;
	gameWon = false;
	initTileGrid();
	updateScore();

	// IMPORTANTE: Renderizar primero para crear las celdas de fondo
	renderTiles();

	// Luego añadir las fichas iniciales
	addRandomTile();
	addRandomTile();
	renderTiles();
}

const restartButton = document.getElementById("restart-btn");
if (restartButton) {
	restartButton.addEventListener("click", function () {
		initGame();
	});
}

// Botón de leaderboard
const leaderboardButton = document.getElementById("leaderboard-btn");
if (leaderboardButton) {
	leaderboardButton.addEventListener("click", function () {
		leaderboardUI.open();
	});
}

// Botón de instrucciones
const infoButton = document.getElementById("info-btn");
const instructionsModal = document.getElementById("instructions-modal");
const closeInstructionsBtn = document.getElementById("close-instructions");

if (infoButton && instructionsModal) {
	infoButton.addEventListener("click", function () {
		instructionsModal.classList.add("active");
		document.body.style.overflow = 'hidden';
	});

	if (closeInstructionsBtn) {
		closeInstructionsBtn.addEventListener("click", function () {
			instructionsModal.classList.remove("active");
			document.body.style.overflow = '';
		});
	}

	// Cerrar al hacer click fuera
	instructionsModal.addEventListener("click", function (e) {
		if (e.target === instructionsModal) {
			instructionsModal.classList.remove("active");
			document.body.style.overflow = '';
		}
	});
}

// Re-renderizar cuando cambia el tamaño de la ventana (para responsive)
let resizeTimeout;
window.addEventListener('resize', function () {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(function () {
		renderTiles();
	}, 100);
});

window.onload = function () {
	// Pequeño delay para asegurar que las variables CSS estén cargadas
	setTimeout(function () {
		initGame();
	}, 50);
};