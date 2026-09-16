#!/bin/sh
set -e

: "${NGINX_SERVER_NAME:?NGINX_SERVER_NAME is required}"
: "${API_BACKEND:?API_BACKEND is required}"

# O entrypoint do nginx só resolve variáveis em /etc/nginx/templates. As
# locations do produto ficam fora dali, então resolvem aqui as mesmas
# variáveis. A lista é explícita para não tocar em variáveis do nginx ($host,
# $api_backend e afins).
if [ -d /etc/nginx/app-locations ]; then
    for location_file in /etc/nginx/app-locations/*.conf; do
        [ -f "$location_file" ] || continue
        envsubst '${API_BACKEND} ${NGINX_SERVER_NAME}' \
            <"$location_file" >"$location_file.resolved"
        mv "$location_file.resolved" "$location_file"
    done
fi

# Executar o entrypoint padrão do nginx que processa templates
exec /docker-entrypoint.sh nginx -g "daemon off;"

