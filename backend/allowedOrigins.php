<?php
    require_once __DIR__ . '/config/env.php';
    sulattam_load_env(__DIR__ . '/.env');

    $allowedOrigins = array_values(array_filter(array_map(
        'trim',
        explode(',', env('ALLOWED_ORIGINS', 'http://localhost:5173'))
    )));
?>
