# 2048

El clásico 2048 en JavaScript, sin librerías, con controles táctiles para móvil y una clasificación
online. Lo hice en la piscina de Globant (diciembre de 2025) para entender bien la lógica de la
cuadrícula: cómo se desplazan y se fusionan las fichas en cada dirección.

**Juégalo en [2048.volmer.es](https://2048.volmer.es/).**

## Qué tiene

- Tablero de 4×4 con fichas animadas. Se juega con las flechas, con WASD o deslizando el dedo.
- Pantallas de victoria (al llegar a 2048) y de fin de partida, con botón para reintentar.
- Instrucciones en un modal («Cómo jugar»).
- **Clasificación**: al acabar puedes guardar tu puntuación con un nombre, que no se puede repetir. Una
  pequeña API en PHP la guarda en MySQL.

## Estructura

| | |
|---|---|
| `index.html`, `styles.css`, `phone.css` | La página y sus estilos, con ajustes para móvil |
| `js/grid.js`, `js/movement.js` | El tablero y la lógica de desplazar y fusionar |
| `js/game.js`, `js/main.js`, `js/ui.js` | Estado de la partida, puntuación y pantallas |
| `js/touch.js` | Gestos táctiles |
| `js/leaderboard.js`, `js/leaderboard-ui.js` | Cliente de la clasificación |
| `api/` | `get_leaderboard.php` y `save_score.php` |
| `database.sql` | Tabla `leaderboard`, con unas puntuaciones de ejemplo |

## Arrancarlo

Para jugar basta con servir la carpeta. Con Docker:

```bash
docker compose up --build     # http://localhost:8080
```

La imagen es un Nginx que sirve los ficheros estáticos, así que **la clasificación no funciona en
local**: necesita PHP y MySQL. En el servidor, la API carga la conexión desde
`config/config.php`, dos niveles por encima de `api/` y fuera del repo, que define
`getDBConnection()`. La tabla se crea con `database.sql`.
