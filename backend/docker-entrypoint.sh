#!/usr/bin/env sh

# service nginx start
php-fpm -D && supervisord
nginx -g 'daemon off;'
