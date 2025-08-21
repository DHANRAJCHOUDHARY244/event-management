<?php
declare(strict_types=1);
require_once __DIR__."/bootstrap.php";
require_once __DIR__."/jwt.php";

header("Content-Type: application/json");

// Ensure 'events' table exists
$pdo->exec("
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    creator_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");

$user = verifyJWTFromHeader();
if (!$user) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET": // list events
        $stmt = $pdo->query("SELECT * FROM events ORDER BY date ASC");
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "events" => $events]);
        break;

    case "POST": // create event (Event Creator/Admin)
        if (!in_array($user['role'], ['admin', 'organizer'])) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Forbidden"]);
            exit;
        }
        $data = body();
        $title = $data['title'] ?? '';
        $date = $data['date'] ?? '';
        $venue = $data['venue'] ?? '';
        $desc = $data['description'] ?? '';
        $img = $data['image'] ?? '';

        if (!$title || !$date || !$venue) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing fields"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO events (title, date, venue, description, image, creator_id) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $date, $venue, $desc, $img, $user['sub']]);
        echo json_encode(["status" => "success", "event_id" => $pdo->lastInsertId()]);
        break;

    case "DELETE": // delete event (Admin)
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Forbidden"]);
            exit;
        }
        $id = intval($_GET['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Event deleted"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
