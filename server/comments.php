<?php // server/comments.php
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
        $eventId=intval($_GET['event_id']??0);
        $res=$conn->query("SELECT c.id,c.comment,c.created_at,u.fullname FROM comments c JOIN users u ON u.id=c.user_id WHERE c.event_id=$eventId ORDER BY created_at DESC");
        $comments=[]; while($row=$res->fetch_assoc()) $comments[]=$row;
        echo json_encode(["status"=>"success","comments"=>$comments]);
        break;

    case "POST":
        $data=json_decode(file_get_contents('php://input'),true);
        $eventId=intval($data['event_id']??0);
        $comment=trim($data['comment']??'');
        if(!$eventId || !$comment){ http_response_code(400); echo json_encode(["status"=>"error","message"=>"Missing fields"]); exit; }
        $stmt=$conn->prepare("INSERT INTO comments (user_id,event_id,comment) VALUES (?,?,?)");
        $stmt->bind_param("iis",$user['sub'],$eventId,$comment);
        $stmt->execute();
        echo json_encode(["status"=>"success","comment_id"=>$stmt->insert_id]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status"=>"error","message"=>"Method not allowed"]);
        break;
}
$conn->close();
