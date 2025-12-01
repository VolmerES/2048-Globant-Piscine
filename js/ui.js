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
        tile = document.createElement("div");
        tile.dataset.id = tileId;
        tile.className = "tile tile-" + value;
        tile.textContent = value;
        tile.style.zIndex = 10;
        // Establecer posición inmediatamente ANTES de añadir al DOM
        tile.style.setProperty('transform', `translate(${j * 95}px, ${i * 95}px)`, 'important');
        tile.style.setProperty('--tx', `${j * 95}px`);
        tile.style.setProperty('--ty', `${i * 95}px`);
        
        // Añadir al DOM
        boardContainer.appendChild(tile);
        
        // Aplicar animación después de estar en el DOM con requestAnimationFrame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            tile.classList.add('tile-new');
            setTimeout(() => tile.classList.remove('tile-new'), 200);
          });
        });
      } else if (tile) {
        // Ficha existente: actualizar posición y valor
        const oldValue = parseInt(tile.textContent);
        
        // Guardar las coordenadas para usarlas en la animación
        const tx = j * 95;
        const ty = i * 95;
        
        // Actualizar posición
        tile.style.setProperty('--tx', `${tx}px`);
        tile.style.setProperty('--ty', `${ty}px`);
        
        if (oldValue !== value) {
          // Se fusionó - primero mover, luego actualizar valor
          
          // NO usar !important para permitir que la animación funcione
          tile.style.transform = `translate(${tx}px, ${ty}px)`;
          
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
              // Después de la animación, volver a aplicar !important
              tile.style.setProperty('transform', `translate(${tx}px, ${ty}px)`, 'important');
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
        tile = document.createElement("div");
        tile.dataset.id = tileId;
        tile.className = "tile tile-" + value;
        tile.textContent = value;
        tile.style.zIndex = 10;
        tile.style.setProperty('transform', `translate(${j * 95}px, ${i * 95}px)`, 'important');
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