-- Base de datos para el Leaderboard del juego 2048

DROP TABLE IF EXISTS leaderboard;

CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL UNIQUE,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_score (score DESC),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Algunos datos de ejemplo para probar
INSERT INTO leaderboard (player_name, score) VALUES 
    ('Gigachad', 5000),
    ('Cyberchad', 8500),
    ('Terachad', 12000);
