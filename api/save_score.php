<?php
// API para guardar una nueva puntuación en el leaderboard
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../config/config.php';

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit();
}

try {
    // Leer datos JSON del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos
    if (!isset($input['player_name']) || !isset($input['score'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Faltan datos requeridos']);
        exit();
    }
    
    $playerName = trim($input['player_name']);
    $score = (int)$input['score'];
    
    // Validaciones
    if (empty($playerName)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'El nombre no puede estar vacío']);
        exit();
    }
    
    if (strlen($playerName) > 20) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'El nombre es demasiado largo (máx 20 caracteres)']);
        exit();
    }
    
    if ($score <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Puntuación inválida']);
        exit();
    }
    
    // Insertar en la base de datos
    $conn = getDBConnection();
    $stmt = $conn->prepare("INSERT INTO leaderboard (player_name, score) VALUES (:player_name, :score)");
    $stmt->bindParam(':player_name', $playerName, PDO::PARAM_STR);
    $stmt->bindParam(':score', $score, PDO::PARAM_INT);
    $stmt->execute();
    
    // Obtener el ID insertado
    $insertedId = $conn->lastInsertId();
    
    // Verificar si está en el top 10
    $rankStmt = $conn->prepare("
        SELECT COUNT(*) + 1 as rank 
        FROM leaderboard 
        WHERE score > :score 
        OR (score = :score AND id < :id)
    ");
    $rankStmt->bindParam(':score', $score, PDO::PARAM_INT);
    $rankStmt->bindParam(':id', $insertedId, PDO::PARAM_INT);
    $rankStmt->execute();
    $rankResult = $rankStmt->fetch();
    $rank = $rankResult['rank'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Puntuación guardada correctamente',
        'data' => [
            'id' => $insertedId,
            'rank' => $rank,
            'is_top_10' => $rank <= 10
        ]
    ]);
    
} catch(PDOException $e) {
    if ($e->getCode() == 23000) { // Código de error para duplicados
        http_response_code(409); // Conflict
        echo json_encode([
            'success' => false,
            'error' => 'Este nombre ya está en uso. Por favor elige otro.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error al guardar la puntuación'
        ]);
    }
}
