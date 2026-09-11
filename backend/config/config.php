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

// Production defaults, required for a cross-site cookie over HTTPS. Docker
// overrides them for same-site plain HTTP on localhost: Chrome and Firefox do
// treat localhost as a trustworthy origin, so Secure would likely work there
// anyway, but the failure mode if it does not (login returns 200, the browser
// silently discards the cookie, every later request 401s) is severe enough not
// to bet on browser behaviour.
$cookieSecure   = filter_var(env('COOKIE_SECURE', 'true'), FILTER_VALIDATE_BOOL);
$cookieSameSite = env('COOKIE_SAMESITE', 'None');
