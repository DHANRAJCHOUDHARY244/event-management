<?php // server/login.php
declare(strict_types=1);
require_once __DIR__."/bootstrap.php";
require_once __DIR__."/jwt.php";
require_once __DIR__."/rate_limit.php";

if (!login_allowed()) json_err(login_penalty_message(), 429);

$input = body();
$email    = strtolower(trim((string)($input["email"] ?? "")));
$password = (string)($input["password"] ?? "");

if (!$email || !$password) json_err("Email and password required", 422);

$stmt = $pdo->prepare("SELECT id, fullname, password, role FROM users WHERE email=?");
$stmt->execute([$email]);
$user = $stmt->fetch();
if (!$user || !password_verify($password, $user["password"])) {
  json_err("Invalid credentials", 401);
}

// Access token
$access = make_access_token($user, $ACCESS_TTL);

// Refresh token as httpOnly cookie
$refreshRaw = bin2hex(random_bytes(32));
$expires = time() + $REFRESH_TTL;
$pdo->prepare("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,?)")
    ->execute([$user["id"], hash('sha256',$refreshRaw), $expires]);

setcookie("refresh_token", $refreshRaw, [
  "expires"=>$expires,
  "path"=>"/",
  "httponly"=>true,
  "samesite"=>"Lax",
  "secure"=>false // set true if using HTTPS
]);

json_ok([
  "success"=>true,
  "token"=>$access,
  "user"=>["id"=>$user["id"], "fullname"=>$user["fullname"], "email"=>$email, "role"=>$user["role"]],
  "expiresIn"=>$ACCESS_TTL
]);
