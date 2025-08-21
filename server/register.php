<?php // server/register.php
declare(strict_types=1);
require_once __DIR__."/bootstrap.php";

$input = body();
$fullname = trim((string)($input["fullname"] ?? ""));
$email    = filter_var((string)($input["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$password = (string)($input["password"] ?? "");
$confirm  = (string)($input["confirmPassword"] ?? "");
$role     = (string)($input["role"] ?? "user");

// No self-register as admin
if ($role === "admin") $role = "user";

$errors = [];
if (mb_strlen($fullname) < 3) $errors[] = "Full name must be at least 3 characters.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email format.";
if ($password !== $confirm) $errors[] = "Passwords do not match.";
if (strlen($password) < 8 || !preg_match("/[A-Z]/",$password) || !preg_match("/[0-9]/",$password) || !preg_match("/[!@#$%^&*]/",$password)) {
  $errors[] = "Password must be 8+ chars and include uppercase, number, special char.";
}
if (!in_array($role, ["user","organizer"], true)) $errors[] = "Invalid role.";

if ($errors) json_err("Validation failed", 422, ["errors"=>$errors]);

try {
  $stmt = $pdo->prepare("INSERT INTO users (fullname,email,password,role) VALUES (?,?,?,?)");
  $stmt->execute([$fullname, strtolower($email), password_hash($password, PASSWORD_DEFAULT), $role]);
  json_ok(["success"=>true,"message"=>"Registered successfully"]);
} catch (PDOException $e) {
  if ($e->errorInfo[1] == 1062) json_err("Email already registered", 409);
  json_err("DB error", 500, ["detail"=>$e->getMessage()]);
}
