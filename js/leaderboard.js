class LeaderboardManager {
	constructor(apiBaseUrl) {
		this.apiBaseUrl = apiBaseUrl || '/api';
	}

	/**
	 * Obtiene el leaderboard completo desde la API
	 * @returns {Promise<Array>} Lista de puntuaciones ordenadas
	 */
	async getLeaderboard() {
		try {
			const response = await fetch(`${this.apiBaseUrl}/get_leaderboard.php`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				return data.data;
			} else {
				throw new Error(data.error || 'Error al obtener el leaderboard');
			}
		} catch (error) {
			console.error('Error fetching leaderboard:', error);
			throw error;
		}
	}

	/**
	 * Guarda una nueva puntuación en el leaderboard
	 * @param {string} playerName - Nombre del jugador
	 * @param {number} score - Puntuación obtenida
	 * @returns {Promise<Object>} Información sobre la puntuación guardada
	 */
	async saveScore(playerName, score) {
		try {
			const response = await fetch(`${this.apiBaseUrl}/save_score.php`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					player_name: playerName,
					score: score
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				return data.data;
			} else {
				throw new Error(data.error || 'Error al guardar la puntuación');
			}
		} catch (error) {
			console.error('Error saving score:', error);
			throw error;
		}
	}

	/**
	 * Verifica si una puntuación entraría en el top 10
	 * @param {number} score - Puntuación a verificar
	 * @returns {Promise<boolean>}
	 */
	async isTopScore(score) {
		try {
			const leaderboard = await this.getLeaderboard();
			if (leaderboard.length < 10) {
				return true;
			}
			const lowestTopScore = leaderboard[leaderboard.length - 1].score;
			return score > lowestTopScore;
		} catch (error) {
			console.error('Error checking top score:', error);
			return false;
		}
	}
}
const leaderboardManager = new LeaderboardManager('/api');
