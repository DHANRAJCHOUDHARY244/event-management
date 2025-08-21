<?php // server/notifications.php
declare(strict_types=1);
require_once __DIR__."/config.php";
require_once __DIR__."/jwt.php";
header('Content-Type: application/json');

$user = verifyJWTFromHeader();
if(!$user){ http_response_code(401); echo json_encode(["status"=>"error","message"=>"Unauthorized"]); exit; }

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case "GET":
        $res = $conn->query("SELECT * FROM notifications WHERE user_id=".$user['sub']." ORDER BY created_at DESC");
        $notes = [];
        while($row=$res->fetch_assoc()) $notes[]=$row;
        echo json_encode(["status"=>"success","notifications"=>$notes]);
        break;

    case "POST":
        if($user['role']!=='admin'){ http_response_code(403); echo json_encode(["status"=>"error","message"=>"Forbidden"]); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $msg = trim($data['message'] ?? '');
        $userId = intval($data['user_id'] ?? 0);
        if(!$msg || !$userId){ http_response_code(400); echo json_encode(["status"=>"error","message"=>"Missing fields"]); exit; }
        $stmt = $conn->prepare("INSERT INTO notifications (user_id,message) VALUES (?,?)");
        $stmt->bind_param("is",$userId,$msg);
        $stmt->execute();
        echo json_encode(["status"=>"success","notification_id"=>$stmt->insert_id]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status"=>"error","message"=>"Method not allowed"]);
        break;
}
$conn->close();
