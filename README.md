# React Restful Client Base

Projeto base para desenvolvimento de Apps React. Esse projeto já vem com gerenciamento de usuários, perfis e permissões, deixando para o desenvolvedor apenas a preocupação com as funcionalidades específicas do seu projeto. A ideia é não se preocupar com o funcionamento desse projeto base, e nem mesmo alterá-lo. **Leia com atenção as instruções**.

## Instruções

- **0** Preparar a API integrada: https://github.com/jhonnyjks/laravel-api-generator
- **1** Clonar este repositório, depois entrar no diretório que foi criado na clonagem:

  ```

  git clone https://github.com/jhonnyjks/react-restful-client client
  cd client
  ```
- **2** Rodar via docker

  ```

  docker compose up --build
  ```
- **3** O App deve estar acessível em:

  - http://localhost:3000
  - Login: admin
  - Senha: 123

## Desenvolvimento dos módulos customizados

- Módulos específicos do seu projeto deverão ser implementados da seguinte forma:
- **0** Dentro da raiz deste projeto, navegar até o diretório 'src'

  ```
  cd src
  ```
- **1** Clonar skeleton ou seu projeto já existente:

  use o comando para clonar o skeleton em /src/app

  ```
  git clone https://github.com/jhonnyjks/rrc-app-skeleton app
  ```
- **2** Se for novo projeto, criar novo repositório e setar a url remota:

  use o comando para direcionar sua interação para seu novo repositório

  ```
  git remote set-url origin https://github.com/SEU_USER/SEU_REPOSITORIO app
  ```

  **3** Implementar seus módulos dentro desse repositório 'em /src/app'.

## Demais configurações conforme padrão React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
