<?php // server/bootstrap.php
declare(strict_types=1);

require_once __DIR__."/config.php";

header("Content-Type: application/json");

// CORS — set your React origin here (Vite default: 5173)
$origin = $_SERVER['HTTP_ORIGIN'] ?? "";
$allowed = ["http://localhost:5173","http://127.0.0.1:5173","http://localhost"];
if (in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
  header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function json_ok($data=[], int $code=200){ http_response_code($code); echo json_encode($data); exit; }
function json_err($msg, int $code=400, $extra=[]){ http_response_code($code); echo json_encode(["error"=>$msg]+$extra); exit; }
function body(): array { return json_decode(file_get_contents("php://input"), true) ?? []; }

// Tables
$pdo->exec("
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','organizer','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  expires_at INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");
$pdo->exec("
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_registration (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");
// ----------------- ADD DEFAULT ADMIN -----------------
$checkAdmin = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin'");
$checkAdmin->execute();
$adminExists = $checkAdmin->fetchColumn();

if (!$adminExists) {
    $fullname = "Default Admin";
    $email = "admin@admin.com";
    $passwordHash = password_hash("Admin@123", PASSWORD_BCRYPT);
    $role = "admin";

    $insertAdmin = $pdo->prepare("INSERT INTO users (fullname, email, password, role) VALUES (?,?,?,?)");
    $insertAdmin->execute([$fullname, $email, $passwordHash, $role]);

    error_log("✅ Default admin created: Email = admin@admin.com | Password = Admin@123");
}
