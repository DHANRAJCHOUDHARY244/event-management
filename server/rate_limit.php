<?php // server/rate_limit.php
declare(strict_types=1);

function login_allowed(): bool {
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $key = sys_get_temp_dir()."/login_".md5($ip).".json";
  $now = time();
  $data = ["count"=>0,"reset"=>$now+300]; // 5 minutes
  if (file_exists($key)) {
    $data = json_decode(file_get_contents($key), true) ?: $data;
    if ($data["reset"] < $now) $data = ["count"=>0,"reset"=>$now+300];
  }
  $data["count"]++;
  file_put_contents($key, json_encode($data));
  return $data["count"] <= 10; // max 10 tries / 5 minutes / IP
}

function login_penalty_message(): string {
  return "Too many attempts. Please wait a few minutes.";
}
