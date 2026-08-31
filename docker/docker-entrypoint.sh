#!/bin/sh
set -e

: "${NGINX_SERVER_NAME:=_}"
export NGINX_SERVER_NAME

# Obter o IP do gateway (host.docker.internal)
# O extra_hosts adiciona host.docker.internal ao /etc/hosts
# Vamos ler o IP de lá, ou usar o gateway da rede
GATEWAY_IP=""

# Tenta ler do /etc/hosts primeiro (se extra_hosts funcionou)
if [ -f /etc/hosts ]; then
    GATEWAY_IP=$(grep "host.docker.internal" /etc/hosts | awk '{ print $1 }' | head -1 || echo "")
fi

# Se não encontrou, tenta obter o gateway da rota padrão
if [ -z "$GATEWAY_IP" ]; then
    GATEWAY_IP=$(ip route | awk '/default/ { print $3 }' | head -1 || echo "")
fi

# Se host.docker.internal estiver na API_BACKEND, substituir pelo IP do gateway
if [ -n "$GATEWAY_IP" ] && echo "$API_BACKEND" | grep -q "host.docker.internal"; then
    export API_BACKEND=$(echo "$API_BACKEND" | sed "s/host.docker.internal/$GATEWAY_IP/g")
    echo "[nginx] Resolved host.docker.internal to $GATEWAY_IP"
fi

# Executar o entrypoint padrão do nginx que processa templates
exec /docker-entrypoint.sh nginx -g "daemon off;"

