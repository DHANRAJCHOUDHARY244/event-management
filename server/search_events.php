<?php // server/search_events.php
declare(strict_types=1);
require_once __DIR__."/config.php";
require_once __DIR__."/jwt.php";
header('Content-Type: application/json');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$search = trim($_GET['q'] ?? '');
$category = trim($_GET['category'] ?? '');
$startDate = trim($_GET['start_date'] ?? '');
$endDate = trim($_GET['end_date'] ?? '');
$page = max(intval($_GET['page']??1),1);
$limit = max(intval($_GET['limit']??10),1);
$offset = ($page-1)*$limit;

$where = [];
$params = []; $types = '';
if($search){ $where[]="title LIKE ?"; $params[]="%$search%"; $types.="s"; }
if($category){ $where[]="category=?"; $params[]=$category; $types.="s"; }
if($startDate){ $where[]="date >= ?"; $params[]=$startDate; $types.="s"; }
if($endDate){ $where[]="date <= ?"; $params[]=$endDate; $types.="s"; }

$sql = "SELECT * FROM events";
if($where) $sql.=" WHERE ".implode(" AND ",$where);
$sql.=" ORDER BY date ASC LIMIT $limit OFFSET $offset";

$stmt = $conn->prepare($sql);
if($params){
    $stmt->bind_param($types,...$params);
}
$stmt->execute();
$res = $stmt->get_result();
$events = []; while($row=$res->fetch_assoc()) $events[]=$row;

echo json_encode(["status"=>"success","page"=>$page,"limit"=>$limit,"events"=>$events]);
$conn->close();
