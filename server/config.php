<?php // server/config.php
declare(strict_types=1);

$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASS = "";
$DB_NAME = "namo";

$JWT_SECRET = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET"; // <= change in prod
$ACCESS_TTL = 15 * 60;       // 15 minutes
$REFRESH_TTL = 7 * 24 * 3600; // 7 days

try {
  $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  exit("DB connection failed: ".$e->getMessage());
}
