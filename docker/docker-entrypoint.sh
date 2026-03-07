#!/bin/sh
set -e

# Default backend URL if not provided
: "${BACKEND_URL:=host.docker.internal:8081}"

echo "╔══════════════════════════════════════════╗"
echo "║  TV Display — Nginx Startup              ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Backend URL: ${BACKEND_URL}"
echo "╚══════════════════════════════════════════╝"

# Substitute environment variables in Nginx config template
envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Validate nginx config
nginx -t

# Start Nginx in foreground
exec nginx -g 'daemon off;'
