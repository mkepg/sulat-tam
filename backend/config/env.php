<?php
/**
 * Minimal .env loader.
 *
 * Dependency-free on purpose: Composer is already required for php-jwt and
 * PHPMailer, but pulling in a full dotenv package for ~20 lines of parsing is
 * disproportionate. Real environment variables always win over the file, so a
 * container can set config without a .env existing at all.
 */

if (!function_exists('sulattam_load_env')) {
    function sulattam_load_env(string $path): void
    {
        if (!is_readable($path)) {
            return; // No file: rely on real environment variables.
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Strip one matched pair of surrounding quotes.
            if (strlen($value) >= 2
                && ($value[0] === '"' || $value[0] === "'")
                && $value[strlen($value) - 1] === $value[0]
            ) {
                $value = substr($value, 1, -1);
            }

            // Do not clobber variables the environment already provides.
            if ($key !== '' && getenv($key) === false) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
    }
}

if (!function_exists('env')) {
    function env(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);
        return $value === false ? $default : $value;
    }
}
