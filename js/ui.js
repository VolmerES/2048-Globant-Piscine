// Función helper para obtener el espaciado de las fichas según el tamaño de pantalla
function getTileSpacing() {
	const width = window.innerWidth;
	let spacing;

	if (width <= 360) {
		// Móvil muy pequeño
		spacing = 58; // 53px tile + 5px gap
	} else if (width <= 480) {
		// Móvil pequeño
		spacing = 68; // 62px tile + 6px gap
	} else if (width <= 768) {
		// Tablet
		spacing = 83; // 75px tile + 8px gap
	} else {
		// Desktop
		spacing = 95; // 85px tile + 10px gap
	}

	console.log('Window width:', width, 'px | Tile spacing:', spacing, 'px');
	return spacing;
}

function updateScore() {
	document.getElementById("score").textContent = score;
}

function renderTiles(newTilePos = null) {
	const boardContainer = document.getElementById("grid");
	const spacing = getTileSpacing();

	// Primera vez: crear celdas de fondo
	if (boardContainer.querySelectorAll('.tile-background').length === 0) {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const cell = document.createElement("div");
				cell.className = "tile-background";
				cell.style.transform = `translate(${j * spacing}px, ${i * spacing}px)`;
				boardContainer.appendChild(cell);
			}
		}
	} else {
		// Actualizar posiciones de celdas de fondo existentes
		const backgrounds = boardContainer.querySelectorAll('.tile-background');
		let index = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (backgrounds[index]) {
					backgrounds[index].style.transform = `translate(${j * spacing}px, ${i * spacing}px)`;
				}
				index++;
			}
		}
	}

	// Obtener fichas existentes por ID
	const existingTiles = Array.from(boardContainer.querySelectorAll('.tile[data-id]'));
	const tilesById = new Map();

	existingTiles.forEach(tile => {
		const id = parseInt(tile.dataset.id);
		tilesById.set(id, tile);
	});

	const tilesToKeep = new Set();
	const isNewTile = (i, j) => newTilePos && newTilePos.x === i && newTilePos.y === j;

	// Renderizar fichas del grid actual
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			const value = grid[i][j];
			const tileId = tileGrid[i][j];

			if (value === 0) continue;

			let tile = tilesById.get(tileId);

			if (isNewTile(i, j)) {
				// Nueva ficha con animación pop
				const spacing = getTileSpacing();
				tile = document.createElement("div");
				tile.dataset.id = tileId;
				tile.className = "tile tile-" + value;
				tile.textContent = value;
				tile.style.zIndex = 10;

				// Establecer posición INLINE antes de añadir al DOM para evitar flash en (0,0)
				const tx = j * spacing;
				const ty = i * spacing;
				tile.style.transform = `translate(${tx}px, ${ty}px)`;
				tile.style.setProperty('--tx', `${tx}px`);
				tile.style.setProperty('--ty', `${ty}px`);

				// Añadir al DOM
				boardContainer.appendChild(tile);

				// Forzar un reflow para asegurar que la posición se aplique
				void tile.offsetWidth;

				// Aplicar animación después de que la posición esté establecida
				requestAnimationFrame(() => {
					tile.classList.add('tile-new');
					setTimeout(() => tile.classList.remove('tile-new'), 200);
				});
			} else if (tile) {
				// Ficha existente: actualizar posición y valor
				const oldValue = parseInt(tile.textContent);
				const spacing = getTileSpacing();

				// Guardar las coordenadas para usarlas en la animación
				const tx = j * spacing;
				const ty = i * spacing;

				// Actualizar posición
				tile.style.setProperty('--tx', `${tx}px`);
				tile.style.setProperty('--ty', `${ty}px`);

				if (oldValue !== value) {
					// Se fusionó - primero establecer posición inmediatamente, luego actualizar valor

					// Establecer la posición inmediatamente con !important para evitar flash en (0,0)
					tile.style.setProperty('transform', `translate(${tx}px, ${ty}px)`, 'important');

					// Esperar a que termine la animación de movimiento antes de cambiar el valor
					setTimeout(() => {
						tile.textContent = value;

						// Remover clases antiguas específicamente
						tile.classList.remove('tile-' + oldValue);
						tile.classList.add('tile-' + value);

						// Añadir animación de merge
						tile.classList.add('tile-merged');
						setTimeout(() => {
							tile.classList.remove('tile-merged');
						}, 400);
					}, 200); // Esperar a que termine el movimiento (0.2s)
				} else {
					// Solo actualizar posición normalmente
					tile.style.setProperty('transform', `translate(${tx}px, ${ty}px)`, 'important');
					if (!tile.classList.contains('tile-' + value)) {
						tile.className = "tile tile-" + value;
					}
				}
			} else {
				// ID no encontrado (rara vez debería pasar), crear nueva ficha
				const spacing = getTileSpacing();
				tile = document.createElement("div");
				tile.dataset.id = tileId;
				tile.className = "tile tile-" + value;
				tile.textContent = value;
				tile.style.zIndex = 10;
				tile.style.setProperty('transform', `translate(${j * spacing}px, ${i * spacing}px)`, 'important');
				boardContainer.appendChild(tile);
			}

			tilesToKeep.add(tile);
		}
	}

	// Eliminar fichas que ya no existen
	existingTiles.forEach(tile => {
		if (!tilesToKeep.has(tile)) {
			tile.style.opacity = '0';
			setTimeout(() => tile.remove(), 150);
		}
	});
}