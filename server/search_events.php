<?php
declare(strict_types=1);
require_once __DIR__ . "/bootstrap.php";
require_once __DIR__ . "/jwt.php";

header("Content-Type: application/json");

try {
    $user = verifyJWTFromHeader();
    if (!$user) {
        throw new Exception("Unauthorized", 401);
    }

    // Query parameters
    $search = trim($_GET['q'] ?? '');
    $category = trim($_GET['category'] ?? '');
    $startDate = trim($_GET['start_date'] ?? '');
    $endDate = trim($_GET['end_date'] ?? '');
    $sort = $_GET['sort'] ?? 'date_asc';
    $page = max((int)($_GET['page'] ?? 1), 1);
    $limit = max((int)($_GET['limit'] ?? 10), 1);
    $offset = ($page - 1) * $limit;

    // Build dynamic SQL
    $where = [];
    $params = [];

    if ($search) { $where[] = "title LIKE ?"; $params[] = "%$search%"; }
    if ($category) { $where[] = "category = ?"; $params[] = $category; }
    if ($startDate) { $where[] = "date >= ?"; $params[] = $startDate; }
    if ($endDate) { $where[] = "date <= ?"; $params[] = $endDate; }

    // Sorting
    $orderBy = match($sort) {
        'date_desc' => 'date DESC',
        'name_asc' => 'title ASC',
        'name_desc' => 'title DESC',
        default => 'date ASC'
    };

    $sql = "SELECT * FROM events";
    if ($where) { $sql .= " WHERE " . implode(" AND ", $where); }
    $sql .= " ORDER BY $orderBy LIMIT $limit OFFSET $offset";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Total count
    $countSql = "SELECT COUNT(*) FROM events" . ($where ? " WHERE " . implode(" AND ", $where) : "");
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    echo json_encode([
        "status" => "success",
        "status_code" => 200,
        "page" => $page,
        "limit" => $limit,
        "total" => $total,
        "events" => $events
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "status_code" => 500,
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Throwable $e) {
    http_response_code($e->getCode() > 0 ? $e->getCode() : 500);
    echo json_encode([
        "status" => "error",
        "status_code" => $e->getCode() ?: 500,
        "message" => $e->getMessage()
    ]);
}
