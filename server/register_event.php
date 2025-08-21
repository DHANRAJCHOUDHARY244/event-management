<?php // server/register_event.php
declare(strict_types=1);
require_once __DIR__."/config.php";
require_once __DIR__."/jwt.php";
header('Content-Type: application/json');

$user = verifyJWTFromHeader();
if(!$user){ http_response_code(401); echo json_encode(["status"=>"error","message"=>"Unauthorized"]); exit; }

$data = json_decode(file_get_contents('php://input'),true);
$eventId = intval($data['event_id']??0);
if(!$eventId){ http_response_code(400); echo json_encode(["status"=>"error","message"=>"Event ID required"]); exit; }

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// check if already registered
$stmt=$conn->prepare("SELECT id FROM event_registrations WHERE user_id=? AND event_id=?");
$stmt->bind_param("ii",$user['sub'],$eventId);
$stmt->execute(); $stmt->store_result();
if($stmt->num_rows>0){ http_response_code(409); echo json_encode(["status"=>"error","message"=>"Already registered"]); exit; }
$stmt->close();

// register
$stmt=$conn->prepare("INSERT INTO event_registrations (user_id,event_id) VALUES (?,?)");
$stmt->bind_param("ii",$user['sub'],$eventId);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(["status"=>"success","message"=>"Registered successfully"]);
