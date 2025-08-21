<?php // server/logout.php
declare(strict_types=1);
require_once __DIR__."/bootstrap.php";

$refreshRaw = $_COOKIE["refresh_token"] ?? "";
if ($refreshRaw) {
  $hash = hash('sha256',$refreshRaw);
  $pdo->prepare("DELETE FROM refresh_tokens WHERE token=?")->execute([$hash]);
  setcookie("refresh_token","",time()-3600,"/");
}
json_ok(["success"=>true]);
