<?php
    require_once __DIR__ . '/config/env.php';
    sulattam_load_env(__DIR__ . '/.env');

    $host = env('DB_HOST', 'localhost');
    $user = env('DB_USER', 'root');
    $pass = env('DB_PASS', '');
    $db   = env('DB_NAME', 'sulat_tam');

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    }
?>
