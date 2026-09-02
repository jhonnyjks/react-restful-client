#!/bin/sh
set -e

: "${NGINX_SERVER_NAME:?NGINX_SERVER_NAME is required}"
: "${API_BACKEND:?API_BACKEND is required}"

# Executar o entrypoint padrão do nginx que processa templates
exec /docker-entrypoint.sh nginx -g "daemon off;"

