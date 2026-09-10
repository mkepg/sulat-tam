FROM php:8.2-apache

# DEVIATION from task brief (documented, not silent): php:8.2-apache ships
# without a zip extension or an unzip/7z binary. `composer install` needs one
# of those to extract dist packages, so without this step the very next RUN
# (composer install) fails with "The zip extension and unzip/7z commands are
# both missing, skipping." Verified by a failed build attempt before adding
# this line.
RUN apt-get update && apt-get install -y --no-install-recommends unzip \
    && rm -rf /var/lib/apt/lists/*

# mysqli is what db_connect.php uses; headers/rewrite are needed for CORS.
RUN docker-php-ext-install mysqli \
    && a2enmod rewrite headers

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install dependencies first so this layer caches across source edits.
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress

COPY . /var/www/html/

# Endpoints resolve `include '../foo.php'` against the requesting script's
# directory, so the document root must be the backend root — not a subfolder.
