# Cliente React (Vite) – Projeto Base

Interface administrativa construída em React + TypeScript seguindo metodologia Atomic Design, estilizada com Tailwind CSS e integrada à API Laravel via Sanctum.

## 🚀 Início Rápido com Docker (Recomendado)

A forma mais simples e recomendada de executar o projeto é através do Docker, que garante um ambiente consistente e isolado.

### Pré-requisitos

- Docker e Docker Compose instalados
- Redes Docker necessárias criadas (veja abaixo)

### Criar as redes compartilhadas

Se ainda não existem, crie as redes Docker necessárias:

```bash
# Rede principal (já criada automaticamente pelo docker-compose)
docker network create projeto-base-network

# Rede da API (necessária se a API estiver rodando em Docker)
docker network create api_projeto-base-network
```

> **Nota**: Se a API estiver rodando em Docker, o container do client precisa estar conectado à rede `api_projeto-base-network` para se comunicar com o nginx. Isso já está configurado no `docker-compose.dev.yml`.

### Desenvolvimento com Docker

Para rodar o ambiente de desenvolvimento com hot reload:

```bash
# 1. Criar arquivo de ambiente (se ainda não existir)
cp .env.development.example .env.development

# 2. Editar .env.development conforme necessário
# Se a API está em Docker (mesma rede): VITE_API_PROXY_TARGET=http://projeto-base-nginx:80
# Se a API está no host: VITE_API_PROXY_TARGET=http://host.docker.internal:8080
# VITE_APP_NAME="Meu App"

# 3. Iniciar o container
docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

A aplicação estará disponível em `http://localhost:5173` com hot reload ativo.

**Variáveis de ambiente para desenvolvimento:**
- `VITE_API_PROXY_TARGET`: URL do backend da API
  - **API em Docker (mesma rede)**: `http://projeto-base-nginx:80` (recomendado)
  - **API no host local**: `http://host.docker.internal:8080`
- `VITE_APP_NAME`: Nome da aplicação (padrão: `Projeto Base`)

### Produção com Docker

Para rodar o ambiente de produção:

```bash
# 1. Criar arquivo de ambiente (se ainda não existir)
cp .env.production.example .env.production

# 2. Editar .env.production conforme necessário
# API_BACKEND=http://host.docker.internal:8080
# CLIENT_PORT=3000
# VITE_APP_NAME="Meu App"

# 3. Iniciar o container
docker compose --env-file .env.production up --build
```

A aplicação estará disponível na porta configurada (padrão: `3000`).

**Variáveis de ambiente para produção:**
- `API_BACKEND`: URL do backend da API (padrão: `http://host.docker.internal:8080`)
- `CLIENT_PORT`: Porta do cliente (padrão: `3000`)
- `VITE_APP_NAME`: Nome da aplicação usado no título e páginas (padrão: `Projeto Base`)

> 💡 **Dica**: Para mais detalhes sobre configuração Docker, consulte o arquivo [DOCKER.md](./DOCKER.md).

---

## 💻 Execução sem Docker

Se preferir executar o projeto diretamente no seu ambiente local, siga as instruções abaixo.

### Pré-requisitos

- Node.js ≥ 20
- npm ≥ 10

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
# Executa a aplicação com Vite e proxy para a API
# Se a API está rodando localmente:
VITE_API_PROXY_TARGET=http://127.0.0.1:8080 npm run dev

# Se a API está em Docker (mesma rede):
VITE_API_PROXY_TARGET=http://projeto-base-nginx:80 npm run dev
```

**Variáveis relevantes:**

| Variável | Ambiente | Descrição |
| --- | --- | --- |
| `VITE_API_PROXY_TARGET` | dev | URL do contêiner/host da API para o proxy do Vite. Se omitida, usa `http://127.0.0.1:8080`. |
| `VITE_API_BASE_URL` | build/dev | Base utilizada pelo `axios`. Padrão: `/api`. Mantenha `/api` quando existir proxy reverso cuidando do roteamento também em produção. |

O proxy do Vite encaminha `'/api'` e `'/sanctum'` para a API e reescreve cookies para o domínio atual, garantindo compatibilidade com Laravel Sanctum.

### Produção

```bash
VITE_API_BASE_URL=https://api.seudominio.com npm run build
npm run preview
```

**Recomendações:**

- Configure o reverse proxy (ex.: Nginx) do frontend para encaminhar `/api` e `/sanctum` para o backend.
- Garanta que as variáveis `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN` e CORS no backend incluam o host do frontend.
- Se mantiver `VITE_API_BASE_URL=/api`, certifique-se de que o proxy em produção trate o roteamento entre contêineres (sem paths absolutos entre eles).

---

## 📋 Padrões adotados

- **Atomic Design**: componentes em `components/atoms`, `molecules`, `organisms` e `templates`.
- **Estado**: zustand + React Query para sessões, permissões e carregamento de dados.
- **Feedback de requisições**: hooks `useApiQuery` e `useApiMutation` padronizam loading e tratamento de erro.
- **Sanctum**: `sanctum/csrf-cookie` é solicitado automaticamente antes de operações autenticadas; o cliente envia cookies (`withCredentials`) e cabeçalhos `X-XSRF-TOKEN`.

## 🛠️ Scripts úteis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Modo desenvolvimento com HMR e proxy |
| `npm run build` | Gera build otimizado |
| `npm run preview` | Faz serve do build localmente |

## 📁 Estrutura principal

```
src/
├─ app/                # Providers e roteamento
├─ components/         # Atomic design
├─ hooks/              # Hooks reutilizáveis (axios, toast, auth)
├─ modules/            # Domínios: auth, usuários, perfis
├─ services/api/       # Cliente axios + mapeamento de API
└─ store/              # Zustand stores (auth, toast)
```

## 🔐 Fluxo de autenticação

1. `getCsrfCookie()` requisita `/sanctum/csrf-cookie` (com proxy/cookies).
2. O login envia credenciais e armazena o token Sanctum + perfis/permissões.
3. Todas as requisições subsequentes enviam cookies e `Authorization` (se aplicável).
4. Respostas `401` limpam sessão e redirecionam para `/login`.

Para dúvidas adicionais consulte a documentação da API (`/api-docs`) ou o time responsável pelo backend.
