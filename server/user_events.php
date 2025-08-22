<?php
declare(strict_types=1);
require_once __DIR__ . "/bootstrap.php";
require_once __DIR__."/jwt.php";

header('Content-Type: application/json');

$user = verifyJWTFromHeader();
if (!$user) { http_response_code(401); echo json_encode(["status"=>"error","message"=>"Unauthorized"]); exit; }

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case "GET":
            // Fetch events created by user
            $stmt = $pdo->prepare("SELECT * FROM events WHERE creator_id=? ORDER BY date ASC");
            $stmt->execute([$user['sub']]);
            $createdEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch events registered by user
            $stmt = $pdo->prepare("
                SELECT e.* FROM events e
                JOIN event_registrations r ON e.id=r.event_id
                WHERE r.user_id=? ORDER BY e.date ASC
            ");
            $stmt->execute([$user['sub']]);
            $registeredEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status"=>"success",
                "createdEvents"=>$createdEvents,
                "registeredEvents"=>$registeredEvents
            ]);
            break;

        case "DELETE":
            // Cancel registration
            $data = json_decode(file_get_contents('php://input'), true);
            $eventId = intval($data['event_id'] ?? 0);
            if (!$eventId) throw new Exception("Event ID required", 400);

            $stmt = $pdo->prepare("DELETE FROM event_registrations WHERE user_id=? AND event_id=?");
            $stmt->execute([$user['sub'], $eventId]);

            if ($stmt->rowCount() === 0) throw new Exception("Registration not found", 404);

            echo json_encode(["status"=>"success","message"=>"Registration cancelled"]);
            break;

        default:
            throw new Exception("Method not allowed", 405);
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 400);
    echo json_encode(["status"=>"error","message"=>$e->getMessage()]);
}
