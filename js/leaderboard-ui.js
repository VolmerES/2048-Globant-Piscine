// UI del Leaderboard - Interfaz visual con diseño cyberpunk
class LeaderboardUI {
	constructor() {
		this.modal = null;
		this.isOpen = false;
		this.createModal();
	}

	/**
	 * Crea el modal del leaderboard
	 */
	createModal() {
		// Crear el modal HTML
		const modalHTML = `
            <div id="leaderboard-modal" class="leaderboard-modal">
                <div class="leaderboard-content">
                    <div class="leaderboard-header">
                        <h2 class="leaderboard-title">🏆 LEADERBOARD 🏆</h2>
                        <button class="leaderboard-close" id="close-leaderboard">&times;</button>
                    </div>
                    
                    <div class="leaderboard-body" id="leaderboard-body">
                        <div class="leaderboard-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading rankings...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

		// Insertar en el DOM
		document.body.insertAdjacentHTML('beforeend', modalHTML);
		this.modal = document.getElementById('leaderboard-modal');

		// Event listeners
		document.getElementById('close-leaderboard').addEventListener('click', () => this.close());
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) this.close();
		});
	}

	/**
	 * Abre el modal y carga el leaderboard
	 */
	async open() {
		this.isOpen = true;
		this.modal.classList.add('active');
		document.body.style.overflow = 'hidden'; // Prevenir scroll

		await this.loadLeaderboard();
	}

	/**
	 * Cierra el modal
	 */
	close() {
		this.isOpen = false;
		this.modal.classList.remove('active');
		document.body.style.overflow = ''; // Restaurar scroll
	}

	/**
	 * Carga y muestra el leaderboard
	 */
	async loadLeaderboard() {
		const bodyElement = document.getElementById('leaderboard-body');

		try {
			// Mostrar loading
			bodyElement.innerHTML = `
                <div class="leaderboard-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading rankings...</p>
                </div>
            `;

			// Obtener datos del leaderboard
			const leaderboard = await leaderboardManager.getLeaderboard();

			// Mostrar datos
			if (leaderboard.length === 0) {
				bodyElement.innerHTML = `
                    <div class="leaderboard-empty">
                        <p>No scores yet. Be the first!</p>
                    </div>
                `;
			} else {
				bodyElement.innerHTML = this.renderLeaderboard(leaderboard);
			}
		} catch (error) {
			bodyElement.innerHTML = `
                <div class="leaderboard-error">
                    <p>⚠️ Error loading leaderboard</p>
                    <button onclick="leaderboardUI.loadLeaderboard()" class="retry-btn">Retry</button>
                </div>
            `;
		}
	}

	/**
	 * Renderiza la tabla del leaderboard
	 */
	renderLeaderboard(data) {
		const rows = data.map(entry => {
			const medalClass = entry.rank <= 3 ? `rank-${entry.rank}` : '';
			const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '';

			return `
                <div class="leaderboard-row ${medalClass}">
                    <div class="rank-col">
                        <span class="rank-number">${entry.rank}</span>
                        ${medal ? `<span class="medal">${medal}</span>` : ''}
                    </div>
                    <div class="name-col">${entry.player_name}</div>
                    <div class="score-col">${entry.score.toLocaleString()}</div>
                </div>
            `;
		}).join('');

		return `
            <div class="leaderboard-table">
                <div class="leaderboard-row header-row">
                    <div class="rank-col">RANK</div>
                    <div class="name-col">PLAYER</div>
                    <div class="score-col">SCORE</div>
                </div>
                ${rows}
            </div>
        `;
	}

	/**
	 * Muestra un modal para ingresar el nombre y guardar la puntuación
	 */
	async showSaveScoreModal(score) {
		return new Promise((resolve) => {
			const modalHTML = `
                <div id="save-score-modal" class="leaderboard-modal active">
                    <div class="leaderboard-content save-score-content">
                        <div class="leaderboard-header">
                            <h2 class="leaderboard-title">🎮 NEW HIGH SCORE! 🎮</h2>
                        </div>
                        
                        <div class="save-score-body">
                            <p class="score-display">Your Score: <span class="neon-text">${score.toLocaleString()}</span></p>
                            <p class="enter-name-text">Enter your name:</p>
                            <input 
                                type="text" 
                                id="player-name-input" 
                                class="player-name-input" 
                                placeholder="Your Name"
                                maxlength="50"
                                autocomplete="off"
                            />
                            <div class="save-score-buttons">
                                <button id="save-score-btn" class="save-btn">Save Score</button>
                                <button id="skip-save-btn" class="skip-btn">Skip</button>
                            </div>
                            <div id="save-error" class="save-error"></div>
                        </div>
                    </div>
                </div>
            `;

			document.body.insertAdjacentHTML('beforeend', modalHTML);
			const modal = document.getElementById('save-score-modal');
			const input = document.getElementById('player-name-input');
			const saveBtn = document.getElementById('save-score-btn');
			const skipBtn = document.getElementById('skip-save-btn');
			const errorDiv = document.getElementById('save-error');

			// Focus en el input
			setTimeout(() => input.focus(), 100);

			// Función para guardar
			const saveScore = async () => {
				const playerName = input.value.trim();

				if (!playerName) {
					errorDiv.textContent = 'Please enter your name';
					return;
				}

				saveBtn.disabled = true;
				saveBtn.textContent = 'Saving...';
				errorDiv.textContent = '';

				try {
					await leaderboardManager.saveScore(playerName, score);
					modal.remove();
					resolve(true);
				} catch (error) {
					errorDiv.textContent = 'Error saving score. Please try again.';
					saveBtn.disabled = false;
					saveBtn.textContent = 'Save Score';
				}
			};

			// Event listeners
			saveBtn.addEventListener('click', saveScore);
			skipBtn.addEventListener('click', () => {
				modal.remove();
				resolve(false);
			});
			input.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') saveScore();
			});
		});
	}
}

// Crear instancia global de la UI
const leaderboardUI = new LeaderboardUI();
