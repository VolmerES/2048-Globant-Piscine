<?php
// API para obtener el top 10 del leaderboard
require_once 'config.php';

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn = getDBConnection();
    
    // Obtener el top 10 de puntuaciones
    $stmt = $conn->prepare("
        SELECT 
            player_name,
            score,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as date
        FROM leaderboard 
        ORDER BY score DESC, created_at ASC
        LIMIT 10
    ");
    
    $stmt->execute();
    $results = $stmt->fetchAll();
    
    // Añadir ranking a cada resultado
    $leaderboard = [];
    $rank = 1;
    foreach ($results as $row) {
        $leaderboard[] = [
            'rank' => $rank++,
            'player_name' => htmlspecialchars($row['player_name'], ENT_QUOTES, 'UTF-8'),
            'score' => (int)$row['score'],
            'date' => $row['date']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $leaderboard
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener el leaderboard'
    ]);
}
?>
