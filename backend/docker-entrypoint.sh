#!/bin/sh
set -e

# Configure Apache port if PORT env variable is provided (e.g. Render)
if [ -n "$PORT" ]; then
    sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
fi

# Ensure storage, database, and bootstrap/cache permissions
mkdir -p /var/www/html/database
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod 664 /var/www/html/database/database.sqlite

# Create storage symlink if it doesn't exist
php artisan storage:link --quiet || true

# Run database migrations and seed default digital catalog
php artisan migrate --force || true
php artisan db:seed --force || true

# Execute CMD
exec "$@"