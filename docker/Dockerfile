# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Declarar build args para variáveis do Vite
ARG VITE_APP_NAME=React Client
ARG VITE_API_BASE_URL=/api
ARG VITE_SHOW_MAIN_FOOTER=true
ARG APP_SOURCE_DIR=src/app

# Copiar metadados e política de resolução de dependências
COPY package*.json .npmrc ./

# Instalar dependências
RUN npm ci

# Copiar código fonte (inclui .env.production se existir)
COPY . .

# Exportar build args como variáveis de ambiente para o Vite
# Build args têm prioridade sobre .env.production
RUN set -a && \
    # Exportar build args (eles têm prioridade)
    export VITE_APP_NAME="${VITE_APP_NAME}" && \
    export VITE_API_BASE_URL="${VITE_API_BASE_URL}" && \
    export VITE_SHOW_MAIN_FOOTER="${VITE_SHOW_MAIN_FOOTER}" && \
    export APP_SOURCE_DIR="${APP_SOURCE_DIR}" && \
    # Carregar .env.production se existir (apenas para outras variáveis não passadas como build args)
    if [ -f .env.production ]; then \
      echo "Loading .env.production (build args have priority)..." && \
      while IFS= read -r line || [ -n "$line" ]; do \
        case "$line" in \
          \#*|'') continue ;; \
        esac; \
        line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'); \
        [ -z "$line" ] && continue; \
        var_name=$(echo "$line" | cut -d'=' -f1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'); \
        # Ignorar variáveis que já foram passadas como build args
        if [ "$var_name" != "VITE_APP_NAME" ] && [ "$var_name" != "VITE_API_BASE_URL" ] && [ "$var_name" != "VITE_SHOW_MAIN_FOOTER" ]; then \
          var_value=$(echo "$line" | cut -d'=' -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'); \
          var_value=$(echo "$var_value" | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/"); \
          eval "export ${var_name}=\"${var_value}\""; \
        fi; \
      done < .env.production; \
    fi && \
    # Garantir valores padrão se não definidos
    export VITE_APP_NAME=${VITE_APP_NAME:-React Client} && \
    export VITE_API_BASE_URL=${VITE_API_BASE_URL:-/api} && \
    export VITE_SHOW_MAIN_FOOTER=${VITE_SHOW_MAIN_FOOTER:-true} && \
    export APP_SOURCE_DIR=${APP_SOURCE_DIR:-src/app} && \
    echo "Building ${APP_SOURCE_DIR} with VITE_APP_NAME=${VITE_APP_NAME}" && \
    echo "Building with VITE_API_BASE_URL=${VITE_API_BASE_URL}" && \
    echo "Building with VITE_SHOW_MAIN_FOOTER=${VITE_SHOW_MAIN_FOOTER}" && \
    npm run build && \
    set +a

# Stage 2: Production
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar template do nginx
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

# Copiar entrypoint customizado
COPY docker/docker-entrypoint.sh /custom-entrypoint.sh
RUN chmod +x /custom-entrypoint.sh

EXPOSE 80

# Usar entrypoint customizado que resolve host.docker.internal
ENTRYPOINT ["/custom-entrypoint.sh"]

