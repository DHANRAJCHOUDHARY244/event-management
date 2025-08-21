<?php
// server/register.php
declare(strict_types=1);
require_once __DIR__."/bootstrap.php"; // include your PDO $pdo connection and helper functions
require_once __DIR__."/jwt.php";  
header('Content-Type: application/json');

// Create users table if not exists
$pdo->exec("
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user','organizer','admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// Get input
$input = json_decode(file_get_contents('php://input'), true);

$fname    = trim((string)($input["fname"] ?? ""));
$lname    = trim((string)($input["lname"] ?? ""));
$fullname = $fname . ' ' . $lname;
$email    = filter_var((string)($input["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$password = (string)($input["password"] ?? "");
$confirm  = (string)($input["confirmPassword"] ?? "");
$role     = "user"; // default role

// Validation
$errors = [];
if (mb_strlen($fname) < 2) $errors[] = "First name must be at least 2 characters.";
if (mb_strlen($lname) < 2) $errors[] = "Last name must be at least 2 characters.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email format.";
if ($password !== $confirm) $errors[] = "Passwords do not match.";
if (strlen($password) < 8 || !preg_match("/[A-Z]/",$password) || !preg_match("/[0-9]/",$password) || !preg_match("/[!@#$%^&*]/",$password)) {
    $errors[] = "Password must be 8+ chars and include uppercase, number, special char.";
}

if ($errors) {
    echo json_encode(["status"=>"error","message"=>"Validation failed","errors"=>$errors]);
    http_response_code(422);
    exit;
}

// Check if email already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([strtolower($email)]);
if ($stmt->fetch()) {
    echo json_encode(["status"=>"error","message"=>"Email already registered"]);
    http_response_code(409);
    exit;
}

// Insert new user
try {
    $stmt = $pdo->prepare("INSERT INTO users (fullname,email,password,role) VALUES (?,?,?,?)");
    $stmt->execute([$fullname, strtolower($email), password_hash($password, PASSWORD_DEFAULT), $role]);
    $userId = (int)$pdo->lastInsertId();
    $userData = ["id"=>$userId, "fullname"=>$fullname, "email"=>$email, "role"=>$role];
    $accessToken = make_access_token($userData, $ACCESS_TTL);

    echo json_encode([
        "status" => "success",
        "message" => "Registered successfully",
        "token" => $accessToken,
        "user" => $userData,
        "expiresIn" => $ACCESS_TTL
    ]);
} catch (PDOException $e) {
    echo json_encode(["status"=>"error","message"=>"DB error","detail"=>$e->getMessage()]);
    http_response_code(500);
    exit;
}
