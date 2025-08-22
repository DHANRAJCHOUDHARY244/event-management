<?php
declare(strict_types=1);
require_once __DIR__ . "/bootstrap.php";
require_once __DIR__ . "/jwt.php";

header("Content-Type: application/json");

try {
    // Create events table if not exists
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            date DATETIME NOT NULL,
            venue VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            description TEXT,
            image VARCHAR(10000),
            creator_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    $user = verifyJWTFromHeader();
    if (!$user) throw new Exception("Unauthorized", 401);

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case "GET": 
            $id = intval($_GET['id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid event ID", 400);
            
            // Fetch event
            $stmt = $pdo->prepare("SELECT * FROM events WHERE id=?");
            $stmt->execute([$id]);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$event) {
                throw new Exception("Event not found", 404);
            }
        
            // Fetch registered users
            $stmt = $pdo->prepare("
                SELECT u.id, u.fullname, u.email 
                FROM event_registrations r
                JOIN users u ON r.user_id = u.id
                WHERE r.event_id = ?
            ");
            $stmt->execute([$id]);
            $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            echo json_encode([
                "status" => "success",
                "event" => $event,
                "registrations" => $registrations
            ]);
            break;



        case "POST": // Create event
            if (!in_array($user['role'], ['admin','organizer'])) throw new Exception("Forbidden", 403);
            $data = json_decode(file_get_contents('php://input'), true);
            $title = trim($data['title'] ?? '');
            $date = trim($data['date'] ?? '');
            $venue = trim($data['venue'] ?? '');
            $category = trim($data['category'] ?? '');
            $desc = trim($data['description'] ?? '');
            $img = trim($data['image'] ?? '');

            if (!$title || !$date || !$venue || !$category) throw new Exception("Missing fields", 400);
            if (!strtotime($date)) throw new Exception("Invalid date format", 400);

            $stmt = $pdo->prepare("INSERT INTO events (title,date,venue,category,description,image,creator_id) VALUES (?,?,?,?,?,?,?)");
            $stmt->execute([$title,$date,$venue,$category,$desc,$img,$user['sub']]);
            echo json_encode(["status"=>"success","event_id"=>$pdo->lastInsertId()]);
            break;

        case "DELETE": // Delete event
            if ($user['role'] !== 'admin') throw new Exception("Forbidden", 403);
            $id = intval($_GET['id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid event ID",400);
            $stmt = $pdo->prepare("DELETE FROM events WHERE id=?");
            $stmt->execute([$id]);
            if ($stmt->rowCount()===0) throw new Exception("Event not found",404);
            echo json_encode(["status"=>"success","message"=>"Event deleted successfully"]);
            break;

        default:
            throw new Exception("Method not allowed",405);
    }

} catch (Exception $e) {
    http_response_code($e->getCode() ?200: 200);
    echo json_encode(["status"=>"error","message"=>$e->getMessage()]);
}
