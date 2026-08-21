# Docker - Ambiente Cliente

Este documento descreve como usar os ambientes Docker para o cliente React.

## Pré-requisitos

- Docker e Docker Compose instalados
- Variáveis de ambiente configuradas (via `.env` ou Portainer)

## Criar as redes compartilhadas

As redes Docker devem existir antes de iniciar os containers. Se ainda não existirem, crie-as:

```bash
# Rede principal
docker network create projeto-base-network

# Rede da API (necessária se a API estiver rodando em Docker)
docker network create api_projeto-base-network
```

> **Importante**: Se a API estiver rodando em Docker, o container do client precisa estar conectado à rede `api_projeto-base-network` para se comunicar com o nginx. Isso já está configurado no `docker-compose.dev.yml` do client.

## Configuração via variáveis de ambiente

O cliente é configurado através de arquivos de ambiente específicos para cada ambiente. Crie os arquivos `.env.development` e `.env.production` conforme necessário.

### Desenvolvimento

Crie o arquivo `.env.development` na raiz do projeto:

```bash
# .env.development
VITE_API_PROXY_TARGET=http://host.docker.internal:8080
VITE_APP_NAME="Projeto Base"
```

**Variáveis disponíveis:**
- `VITE_API_PROXY_TARGET`: URL do backend da API para proxy do Vite
  - **API em Docker (mesma rede)**: `http://projeto-base-nginx:80` ⭐ **Recomendado quando ambos estão em Docker**
  - **API no host local**: `http://host.docker.internal:8080`
  - **API externa**: `http://api.example.com`
- `VITE_APP_NAME`: Nome da aplicação (exibido no título e páginas)

> **Nota**: Quando a API está em Docker, use o nome do container (`projeto-base-nginx`) na porta interna (80), não a porta mapeada do host (8080).

### Produção

Crie o arquivo `.env.production` na raiz do projeto:

```bash
# .env.production
API_BACKEND=http://host.docker.internal:8080
CLIENT_PORT=3000
VITE_APP_NAME="Projeto Base"
```

**Variáveis disponíveis:**
- `API_BACKEND`: URL do backend da API
  - **API no host local**: `http://host.docker.internal:8080`
  - **API em Docker (mesma rede)**: `http://projeto-base-nginx:80`
  - **API externa**: `http://api.example.com`
- `CLIENT_PORT`: Porta do cliente (padrão: `3000`)
- `VITE_APP_NAME`: Nome da aplicação usado no título e páginas (padrão: `Projeto Base`)

> ⚠️ **Importante**: Para que `VITE_APP_NAME` seja aplicado corretamente durante o build de produção, você precisa:
> 1. Passar a variável usando `--env-file .env.production`
> 2. Ou definir inline: `VITE_APP_NAME="Meu App" docker compose up --build`
>
> O Dockerfile lê automaticamente o `.env.production` durante o build.

## Desenvolvimento

Para rodar o ambiente de desenvolvimento com hot reload:

```bash
# Carregar variáveis do .env.development
docker compose -f docker-compose.dev.yml --env-file .env.development up --build

# Ou definir inline:
VITE_API_PROXY_TARGET=http://host.docker.internal:8080 VITE_APP_NAME="Meu App" docker compose -f docker-compose.dev.yml up --build
```

A aplicação estará disponível em `http://localhost:5173` com hot reload ativo.

**Características do ambiente de desenvolvimento:**
- ✅ Hot Module Replacement (HMR) ativo
- ✅ Volume montado para edição em tempo real
- ✅ Proxy do Vite para `/api` e `/sanctum`
- ✅ Logs do Vite visíveis no console

## Produção

Para rodar o ambiente de produção:

```bash
# IMPORTANTE: Use --env-file para carregar variáveis do .env.production
docker compose --env-file .env.production up --build

# Ou definir inline:
VITE_APP_NAME="Meu App" API_BACKEND=http://host.docker.internal:8080 docker compose up --build
```

A aplicação estará disponível na porta configurada (padrão: `3000`).

**Características do ambiente de produção:**
- ✅ Build otimizado e minificado
- ✅ Servido via Nginx
- ✅ Proxy reverso para `/api` e `/sanctum`
- ✅ Suporte a SPA routing (redireciona todas as rotas para `index.html`)
- ✅ Resolução DNS dinâmica (não precisa que a API esteja rodando na inicialização)
- ✅ Cache de assets estáticos configurado
- ✅ Headers de segurança configurados

## Estrutura de arquivos Docker

```
client/
├─ docker-compose.dev.yml    # Configuração de desenvolvimento
├─ docker-compose.yml        # Configuração de produção
├─ docker/
│  ├─ Dockerfile.dev         # Imagem para desenvolvimento com Vite
│  ├─ Dockerfile             # Build multi-stage para produção (Node.js + Nginx)
│  ├─ nginx.conf.template    # Template do Nginx com substituição de variáveis
│  └─ docker-entrypoint.sh   # Script de entrada customizado (resolve host.docker.internal)
├─ .env.development          # Variáveis de ambiente para desenvolvimento (criar)
└─ .env.production           # Variáveis de ambiente para produção (criar)
```

## Independência dos Projetos

O cliente pode rodar de forma completamente independente da API:

- ✅ Não precisa que a API esteja rodando para iniciar
- ✅ Configuração via variáveis de ambiente (`.env`)
- ✅ Suporta API no host, em Docker, ou externa
- ✅ Rede compartilhada criada automaticamente (ou manualmente)
- ✅ DNS dinâmico (nginx resolve hostnames em runtime)

## Troubleshooting

### Problema: Container não inicia

**Solução**: Verifique se a rede `projeto-base-network` existe:
```bash
docker network ls | grep projeto-base-network
# Se não existir:
docker network create projeto-base-network
```

### Problema: Erro de conexão com a API

**Solução**: Verifique a variável `VITE_API_PROXY_TARGET` (dev) ou `API_BACKEND` (prod):
- Se a API está no host: use `http://host.docker.internal:8080`
- Se a API está em Docker: use `http://projeto-base-nginx:80` (nome completo do container)
- Certifique-se de que o container do client está conectado à rede `api_projeto-base-network` (já configurado no `docker-compose.dev.yml`)
- Verifique se ambos os containers estão rodando: `docker ps | grep -E "nginx|client"`

### Problema: VITE_APP_NAME não está sendo aplicado

**Solução**: 
1. Certifique-se de que o arquivo `.env.production` existe e contém `VITE_APP_NAME`
2. Use `--env-file .env.production` ao executar `docker compose up --build`
3. O Dockerfile lê automaticamente o `.env.production` durante o build

### Problema: Mudanças não aparecem em desenvolvimento

**Solução**: 
- Verifique se o volume está montado corretamente no `docker-compose.dev.yml`
- Reinicie o container: `docker compose -f docker-compose.dev.yml restart`

## Uso no Portainer

### 1. Criar a rede (se ainda não existir)

- Vá em **Networks** → **Add network**
- Nome: `projeto-base-network`
- Driver: `bridge`
- Clique em **Create the network**

### 2. Criar o Stack

- Crie um novo **Stack** no Portainer
- Cole o conteúdo de `docker-compose.yml` (produção) ou `docker-compose.dev.yml` (desenvolvimento)

### 3. Configurar variáveis de ambiente

**Opção 1 - Arquivo de ambiente:**
- Use os arquivos `.env.production` ou `.env.development`
- Configure no campo **Env file** ou faça upload do arquivo

**Opção 2 - Variáveis manuais:**
- Configure manualmente na seção **Environment variables**
- **Importante**: Para variáveis `VITE_*`, configure também na seção **Build arguments** do stack

**Variáveis necessárias para produção:**
- `API_BACKEND`: URL do backend da API
- `CLIENT_PORT`: Porta do cliente (opcional, padrão: 3000)
- `VITE_APP_NAME`: Nome da aplicação (opcional, padrão: "Projeto Base")

**Variáveis necessárias para desenvolvimento:**
- `VITE_API_PROXY_TARGET`: URL do backend da API
- `VITE_APP_NAME`: Nome da aplicação (opcional, padrão: "Projeto Base")

### 4. Deploy o stack

- Clique em **Deploy the stack**
- Aguarde o build e inicialização do container

> ⚠️ **Importante**: A rede `projeto-base-network` deve existir antes de fazer o deploy do stack.

## Comandos úteis

```bash
# Ver logs do container
docker compose logs -f client

# Parar o container
docker compose down

# Rebuild sem cache
docker compose build --no-cache

# Entrar no container
docker compose exec client sh

# Verificar variáveis de ambiente no container
docker compose exec client env | grep VITE
```
