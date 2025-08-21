<?php // server/users.php
declare(strict_types=1);
require_once __DIR__."/config.php";
require_once __DIR__."/jwt.php";
header('Content-Type: application/json');

$user = verifyJWTFromHeader();
if(!$user){ http_response_code(401); echo json_encode(["status"=>"error","message"=>"Unauthorized"]); exit; }

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case "GET": // Get dashboard info
        // Events created by user
        $created = [];
        if(in_array($user['role'], ['creator','admin'])){
            $res = $conn->query("SELECT * FROM events WHERE creator_id=".$user['sub']." ORDER BY date ASC");
            while($row=$res->fetch_assoc()) $created[]=$row;
        }
        // Events registered by user
        $registered = [];
        $res = $conn->query("SELECT e.* FROM events e JOIN event_registrations r ON e.id=r.event_id WHERE r.user_id=".$user['sub']." ORDER BY e.date ASC");
        while($row=$res->fetch_assoc()) $registered[]=$row;

        echo json_encode(["status"=>"success","created"=>$created,"registered"=>$registered]);
        break;

    case "DELETE": // Cancel registration
        $eventId = intval($_GET['event_id'] ?? 0);
        if(!$eventId){ http_response_code(400); echo json_encode(["status"=>"error","message"=>"Event ID required"]); exit; }

        $stmt = $conn->prepare("DELETE FROM event_registrations WHERE user_id=? AND event_id=?");
        $stmt->bind_param("ii",$user['sub'],$eventId);
        $stmt->execute();
        echo json_encode(["status"=>"success","message"=>"Registration cancelled"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status"=>"error","message"=>"Method not allowed"]);
        break;
}
$conn->close();
