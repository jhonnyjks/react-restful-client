# Docker – cliente skeleton

Ambientes Docker do projeto-base. Nomes de rede, imagem e aplicação são configuráveis para cada produto.

## Pré-requisitos

- Docker e Docker Compose
- Redes externas criadas antes do `up`

```bash
docker network create "${APP_NETWORK:-app-network}"
docker network create "${API_NETWORK:-api-network}"
```

Se a API também estiver em Docker, o client precisa entrar na rede da API. Isso já está no `docker-compose.dev.yml` via `API_NETWORK`.

## Desenvolvimento

Crie `.env.development` a partir do exemplo:

```bash
cp .env.development.example .env.development
```

```bash
VITE_API_PROXY_TARGET=http://host.docker.internal:8080
VITE_APP_NAME="Meu App"
VITE_API_BASE_URL=/api
APP_NETWORK=app-network
API_NETWORK=api-network
CLIENT_CONTAINER_NAME=react-client-dev
```

Suba o ambiente:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

Disponível em `http://localhost:5173` com HMR.

Quando a API está em Docker, use o hostname interno do nginx da API na porta do container, não a porta publicada no host.

## Produção

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production up --build
```

Variáveis:

- `API_BACKEND`: URL da API usada pelo nginx
- `NGINX_SERVER_NAME`: hostname do servidor nginx (padrão `_`)
- `CLIENT_PORT`: porta publicada (padrão `3000`)
- `VITE_APP_NAME`: nome da aplicação no build
- `APP_SOURCE_DIR`: checkout da aplicação usado no build (padrão `src/app`)
- `APP_NETWORK` / `API_NETWORK`: redes Traefik/API
- `CLIENT_IMAGE` / `CLIENT_HOST` / `TRAEFIK_ROUTER`: identidade do serviço

O Dockerfile lê `.env.production` durante o build, mas `VITE_*` passadas como build args têm prioridade.

## Estrutura

```
client/
├─ docker-compose.dev.yml
├─ docker-compose.yml
├─ docker/
│  ├─ Dockerfile.dev
│  ├─ Dockerfile
│  ├─ nginx.conf.template
│  └─ docker-entrypoint.sh
├─ .env.development
└─ .env.production
```

## Independência

O client sobe sem a API estar no ar. Configure o backend via variáveis e deixe o nginx/Vite resolver o host em runtime.

## Troubleshooting

- **Container não inicia**: confirme se as redes `APP_NETWORK` e `API_NETWORK` existem.
- **Falha de proxy com a API**: ajuste `VITE_API_PROXY_TARGET` (dev) ou `API_BACKEND` (prod) e verifique se o client está na mesma rede da API.
- **`VITE_APP_NAME` não aplica**: use `--env-file` no `docker compose up --build`.
- **Hot reload parado**: reinicie o serviço `client`.

## Portainer

1. Crie as redes externas usadas pelo compose.
2. Crie o stack com `docker-compose.yml` ou `docker-compose.dev.yml`.
3. Informe as variáveis (`API_BACKEND`, `VITE_APP_NAME`, nomes de rede). Variáveis `VITE_*` também devem ir em **Build arguments**.

## Comandos úteis

```bash
docker compose logs -f client
docker compose down
docker compose build --no-cache
docker compose exec client sh
```
