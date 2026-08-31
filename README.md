# React Restful Client – Skeleton Vite

Base reutilizável para aplicações administrativas React. O projeto-base fornece o runtime Redux/React Router, componentes genéricos, Vite, Docker e CI. Código de produto não deve ser adicionado aqui.

O domínio de cada produto vive em `src/app`, como checkout Git independente e ignorado pelo repositório pai.

## Contrato padrão da aplicação

Toda aplicação em `src/app` deve expor `exports.js`:

```js
export const reducers = {
  // reducers específicos do produto
};

export const routes = [
  { exact: true, path: '/', component: Dashboard, isCrud: false },
];

export const menu = {
  '/': { title: 'Início', icon: 'home', fixed: true },
};
```

Esse é o mesmo contrato público do [rrc-app-skeleton](https://github.com/jhonnyjks/rrc-app-skeleton). O runtime compartilhado monta os reducers, as rotas e o menu; a implementação de páginas, serviços, permissões, identidade e testes continua no checkout da aplicação.

## Criar um produto

```bash
git clone <url-do-client-react> client
cd client/src
git clone https://github.com/jhonnyjks/rrc-app-skeleton app
cd app
git remote set-url origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO_DE_APP
```

Não adicione `src/app` ao índice do `client-react`.

## Desenvolvimento

Pré-requisitos: Node.js 20.19+ e npm 10+.

```bash
cp .env.development.example .env.development
npm install
npm run dev
```

O Vite também disponibiliza variáveis compatíveis com aplicações legadas:

- `VITE_API_BASE_URL` ou `REACT_APP_API_HOST`
- `VITE_APP_NAME` ou `REACT_APP_NAME`
- `REACT_APP_LOGO`
- `REACT_APP_LOGIN_LOGO`

`APP_SOURCE_DIR` seleciona o diretório da aplicação no build e usa `src/app` por padrão. Ele permite que o CI valide uma aplicação de fixture sem depender de um checkout de produto.

## Validação

```bash
npm run lint
npm run test:contract:legacy
npm run test:contract:app
```

`test:contract:legacy` compila uma fixture que usa o contrato padrão. `test:contract:app` verifica o checkout presente em `src/app`.

## Docker

```bash
docker network create app-network
docker network create api-network
docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

Para produção, use `.env.production`. `NGINX_SERVER_NAME`, `APP_NETWORK`, `API_NETWORK`, `CLIENT_HOST` e `TRAEFIK_ROUTER` são configurações da implantação do produto; o skeleton não inclui hostnames ou redes específicas.

O workflow deste repositório valida a infraestrutura genérica. A imagem de um produto deve ser construída no pipeline ou repositório que fornece seu próprio `src/app`.
