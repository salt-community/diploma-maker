#!/bin/sh

envsubst '$PORT' < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

exec "$@"