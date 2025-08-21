<?php // server/jwt.php
declare(strict_types=1);
require_once __DIR__."/config.php";
require_once __DIR__."/vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function make_access_token(array $user, int $ttl): string {
  global $JWT_SECRET;
  $now = time();
  $payload = [
    "sub" => $user["id"],
    "name"=> $user["fullname"],
    "role"=> $user["role"],
    "iat" => $now,
    "exp" => $now + $ttl
  ];
  return JWT::encode($payload, $JWT_SECRET, "HS256");
}

function verify_access_token(string $token): ?array {
    global $JWT_SECRET;
    try {
        $data = JWT::decode($token, new Key($JWT_SECRET, "HS256"));
        return (array)$data;
    } catch (Throwable $e) {
        return null;
    }
}

function verifyJWTFromHeader(): ?array {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$auth || !str_starts_with($auth, 'Bearer ')) {
        return null;
    }

    $token = trim(str_replace('Bearer ', '', $auth));
    return verify_access_token($token);
}
