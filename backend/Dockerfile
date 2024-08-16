# Set master image
FROM public.ecr.aws/u1z6m6i8/docker-images:php.7.3-fpm-alpine

# Copy composer.lock and composer.json
COPY composer.json /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Install Additional dependencies
RUN apk update && apk add --no-cache \
    build-base shadow vim curl \
    supervisor \
    libpq-dev \
    php7 \
    php7-common \
    php7-redis \
    php7-mcrypt \
    php7-mbstring \
    php7-xml \
    php7-openssl \
    php7-json \
    php7-phar \
    php7-zip \
    php7-gd \
    php7-dom \
    php7-session \
    php7-zlib \
    php7-pgsql

# Add and Enable PHP-PDO Extenstions
RUN docker-php-ext-install pdo pdo_pgsql
RUN docker-php-ext-enable pdo_pgsql

RUN apk add nginx

# Install PHP Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Remove Cache
RUN rm -rf /var/cache/apk/*

# Add UID '1000' to www-data
RUN usermod -u 1000 www-data

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www/html

# Expose port 9000 and start php-fpm server
EXPOSE 80 443 9000

RUN mkdir -p storage/framework/sessions
RUN mkdir -p storage/framework/views
RUN mkdir -p storage/framework/cache

RUN chmod -R 777 storage

COPY nginx.conf /etc/nginx/http.d/default.conf

COPY laravel-worker-sample.conf /etc/supervisor.d/worker.ini

RUN composer install --ignore-platform-req=ext-gd --ignore-platform-req=ext-zip

RUN chmod 777 ./docker-entrypoint.sh

ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]
