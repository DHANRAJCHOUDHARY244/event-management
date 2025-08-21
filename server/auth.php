<?php // server/auth.php
declare(strict_types=1);
require_once __DIR__."/bootstrap.php";
require_once __DIR__."/jwt.php";

function get_bearer(): ?string {
  $hdr = $_SERVER["HTTP_AUTHORIZATION"] ?? "";
  if (stripos($hdr, "Bearer ") === 0) return substr($hdr, 7);
  return null;
}

function require_auth(): array {
  $token = get_bearer();
  if (!$token) json_err("Missing bearer token", 401);
  $decoded = verify_access_token($token);
  if (!$decoded) json_err("Invalid or expired token", 401);
  return $decoded;
}

function require_role(array $decoded, array $roles): void {
  if (!in_array($decoded["role"] ?? "user", $roles, true)) {
    json_err("Forbidden: insufficient role", 403);
  }
}
