# Cliente React (Vite) – Skeleton

Projeto-base reutilizável para aplicações administrativas em React + TypeScript. Ele fornece Atomic Design, Tailwind CSS, integração genérica com APIs Laravel via Sanctum e a infraestrutura de build. **Não coloque regras de negócio aqui.**

O domínio do produto vive em `src/app`, um checkout Git independente, no mesmo contrato do [rrc-app-skeleton](https://github.com/jhonnyjks/rrc-app-skeleton).

## Fronteira skeleton / app

| Camada | Caminho | Responsabilidade |
| --- | --- | --- |
| Skeleton | este repositório | Componentes, hooks de feedback, utilitários, Vite, Docker |
| Aplicação | `src/app` | Rotas, autenticação, módulos, APIs, navegação e identidade do produto |

O skeleton só conhece a aplicação por `src/App.tsx`, que reexporta o contrato em `src/app/exports.ts`.

### Como criar um produto a partir deste skeleton

```bash
git clone <url-deste-skeleton> client
cd client/src
git clone https://github.com/jhonnyjks/rrc-app-skeleton app
# em seguida, aponte o origin de src/app para o repositório específico do produto
cd app
git remote set-url origin https://github.com/SEU_USER/SEU_REPOSITORIO_DE_MODULOS
```

Implemente páginas, serviços e rotas apenas em `src/app`. O projeto-base não deve importar `@app/*`, exceto no adaptador `src/App.tsx`.

## Início rápido com Docker

```bash
docker network create app-network
docker network create api-network
cp .env.development.example .env.development
docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

A aplicação fica em `http://localhost:5173`.

**Variáveis de desenvolvimento**

- `VITE_API_PROXY_TARGET`: URL da API para o proxy do Vite (`http://host.docker.internal:8080` no host, ou o hostname interno do nginx da API em Docker)
- `VITE_APP_NAME`: nome exibido no título e nas páginas (padrão: `React Client`)
- `APP_NETWORK` / `API_NETWORK`: nomes das redes Docker externas
- `CLIENT_CONTAINER_NAME`: nome do container de desenvolvimento

## Produção com Docker

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production up --build
```

A aplicação fica na porta configurada (padrão: `3000`).

> Detalhes de redes, Traefik e Portainer: [DOCKER.md](./DOCKER.md).

## Execução sem Docker

Pré-requisitos: Node.js ≥ 20 e npm ≥ 10.

```bash
npm install
VITE_API_PROXY_TARGET=http://127.0.0.1:8080 npm run dev
```

O proxy do Vite encaminha `/api` e `/sanctum` para a API e reescreve cookies para o host atual, compatível com Laravel Sanctum.

## Padrões

- **Atomic Design**: `components/atoms`, `molecules`, `organisms` e `templates`.
- **Estado genérico**: Zustand (toast) + React Query via hooks reutilizáveis.
- **Feedback**: `useApiQuery` e `useApiMutation` padronizam loading e erro.
- **Domínio**: exclusivamente em `src/app`.

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Desenvolvimento com HMR e proxy |
| `npm run build` | Typecheck + build |
| `npm run lint` | ESLint + verificação de fronteira |
| `npm run check:boundaries` | Impede vazamento de domínio no skeleton |
| `npm run preview` | Serve o build localmente |
| `npm run test:e2e` | Playwright contra a aplicação em `src/app/e2e` |

## Estrutura

```
src/
├─ App.tsx             # Adaptador do contrato @app/exports
├─ app/                # Checkout Git da aplicação (ignorado por este repositório)
├─ components/         # Atomic Design reutilizável
├─ hooks/              # Hooks genéricos (query, mutation, toast, máscaras)
├─ store/              # Stores genéricos (toast)
└─ utils/              # Utilitários neutros
```

A autenticação, as permissões e o cliente HTTP do produto pertencem a `src/app`.
