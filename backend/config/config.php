<?php
/**
 * Single source of truth for the JWT signing key and auth-cookie flags.
 *
 * Replaces sixteen copy-pasted `$secretKey = "..."` assignments.
 */

require_once __DIR__ . '/env.php';
sulattam_load_env(__DIR__ . '/../.env');

$secretKey = env('JWT_SECRET');

if ($secretKey === null || $secretKey === '') {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Server misconfigured: JWT_SECRET is not set"]);
    exit;
}

// Production defaults. Docker overrides these for same-site HTTP on localhost,
// where a Secure/SameSite=None cookie is silently dropped by the browser.
$cookieSecure   = filter_var(env('COOKIE_SECURE', 'true'), FILTER_VALIDATE_BOOL);
$cookieSameSite = env('COOKIE_SAMESITE', 'None');
