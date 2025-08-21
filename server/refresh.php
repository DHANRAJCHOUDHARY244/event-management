<?php // server/refresh.php
declare(strict_types=1);
require_once __DIR__."/bootstrap.php";
require_once __DIR__."/jwt.php";

$refreshRaw = $_COOKIE["refresh_token"] ?? "";
if (!$refreshRaw) json_err("No refresh token", 401);

$hash = hash('sha256', $refreshRaw);
$stmt = $pdo->prepare("SELECT rt.user_id, u.fullname, u.role FROM refresh_tokens rt JOIN users u ON u.id=rt.user_id WHERE rt.token=? AND rt.expires_at > ?");
$stmt->execute([$hash, time()]);
$row = $stmt->fetch();
if (!$row) json_err("Invalid refresh token", 401);

// rotate refresh (optional bonus)
$pdo->prepare("DELETE FROM refresh_tokens WHERE token=?")->execute([$hash]);
$newRaw = bin2hex(random_bytes(32));
$expires = time() + $REFRESH_TTL;
$pdo->prepare("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,?)")
    ->execute([$row["user_id"], hash('sha256',$newRaw), $expires]);

setcookie("refresh_token", $newRaw, [
  "expires"=>$expires,"path"=>"/","httponly"=>true,"samesite"=>"Lax","secure"=>false
]);

$access = make_access_token(
  ["id"=>$row["user_id"],"fullname"=>$row["fullname"],"role"=>$row["role"]],
  $ACCESS_TTL
);
json_ok(["token"=>$access,"expiresIn"=>$ACCESS_TTL]);
