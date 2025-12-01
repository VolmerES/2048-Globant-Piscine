/* ------------------------------------------ */
/*        CONTROLES TÁCTILES PARA MÓVIL       */
/* ------------------------------------------ */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Distancia mínima para considerar un swipe (en píxeles)
const MIN_SWIPE_DISTANCE = 30;

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
	// Obtener el elemento del grid
	const gridElement = document.getElementById('grid');

	if (!gridElement) {
		console.error('No se encontró el elemento grid');
		return;
	}

	// Detectar cuando el usuario toca la pantalla
	gridElement.addEventListener('touchstart', function (event) {
		// Prevenir el scroll mientras se juega
		event.preventDefault();

		touchStartX = event.changedTouches[0].screenX;
		touchStartY = event.changedTouches[0].screenY;
	}, { passive: false });

	// Detectar cuando el usuario suelta el dedo
	gridElement.addEventListener('touchend', function (event) {
		// Prevenir el scroll mientras se juega
		event.preventDefault();

		touchEndX = event.changedTouches[0].screenX;
		touchEndY = event.changedTouches[0].screenY;

		handleSwipe();
	}, { passive: false });

	// Prevenir el scroll en todo el body cuando se toca el grid
	document.body.addEventListener('touchmove', function (event) {
		// Solo prevenir si se está tocando el grid
		if (event.target.closest('#grid')) {
			event.preventDefault();
		}
	}, { passive: false });
});

// Función para determinar la dirección del swipe
function handleSwipe() {
	// Si el juego terminó, no hacer nada
	if (gameOver || gameWon) return;

	// Calcular la diferencia en X e Y
	const diffX = touchEndX - touchStartX;
	const diffY = touchEndY - touchStartY;

	// Calcular la distancia absoluta
	const absDiffX = Math.abs(diffX);
	const absDiffY = Math.abs(diffY);

	// Si el movimiento es muy pequeño, ignorarlo
	if (absDiffX < MIN_SWIPE_DISTANCE && absDiffY < MIN_SWIPE_DISTANCE) {
		return;
	}

	let moved = false;

	// Determinar si el swipe es más horizontal o vertical
	if (absDiffX > absDiffY) {
		// Movimiento horizontal
		if (diffX > 0) {
			// Swipe hacia la derecha
			console.log('Swipe: derecha');
			moved = moveRight();
		} else {
			// Swipe hacia la izquierda
			console.log('Swipe: izquierda');
			moved = moveLeft();
		}
	} else {
		// Movimiento vertical
		if (diffY > 0) {
			// Swipe hacia abajo
			console.log('Swipe: abajo');
			moved = moveDown();
		} else {
			// Swipe hacia arriba
			console.log('Swipe: arriba');
			moved = moveUp();
		}
	}

	// Si hubo movimiento, añadir nueva ficha y actualizar
	if (moved) {
		const newTilePos = addRandomTile();
		renderTiles(newTilePos);
		updateScore();
		checkGameState();
		checkGameOver();
	}
}