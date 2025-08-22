<?php
// server/register_event.php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";
require_once __DIR__ . "/jwt.php";
header("Content-Type: application/json");




try {
    $user = verifyJWTFromHeader();
    if (!$user) {
        throw new Exception("Unauthorized", 401);
    }
    $data = body();
    $eventId = intval($data['event_id'] ?? 0);
    
    if ($eventId <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Event ID required"]);
        exit;
    }
    // -------------------- Check if event exists --------------------
    $stmt = $pdo->prepare("SELECT id FROM events WHERE id = ?");
    $stmt->execute([$eventId]);
    if (!$stmt->fetchColumn()) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Event not found"]);
        exit;
    }

    // -------------------- Check if user already registered --------------------
    $stmt = $pdo->prepare("SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?");
    $stmt->execute([$user['sub'], $eventId]);
    if ($stmt->fetchColumn()) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "Already registered"]);
        exit;
    }

    // -------------------- Register user --------------------
    $stmt = $pdo->prepare("INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)");
    $stmt->execute([$user['sub'], $eventId]);

    echo json_encode(["status" => "success", "message" => "Registered successfully"]);

} catch (PDOException $e) {
    http_response_code(200);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
