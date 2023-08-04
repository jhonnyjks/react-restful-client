# React Restful Client Basee
Projeto base para desenvolvimento de Apps React. Esse projeto já vem com gerenciamento de usuários, perfis e permissões, deixando para o desenvolvedor apenas a preocupação com as funcionalidades específicas do seu projeto. A ideia é não se preocupar com o funcionamento desse projeto base, e nem mesmo alterá-lo. **Leia com atenção as instruções**.
## Instruções
- **0** Preparar a API integrada: https://github.com/jhonnyjks/laravel-api-generator
- **1** Instalar o NodeJS (~14.7.0): https://nodejs.org/
- **2** Clonar este repositório, depois entrar no diretório que foi criado na clonagem:
         
        # use o comando para clonar este repositório
        git clone https://github.com/jhonnyjks/react-restful-client client
        
- **3** Baixar dependências dentro do diretório raiz do projeto.
         
        # use o comando para instalar dependências do react
        cd client
        npm i
        
- **4** Copiar arquivo de ambiente de desenvolvimento.
         
        cp .env.development.example .env.development
        
- **5** executar o comando `npm start` para rodar o projeto
       
        # use o comando para rodar o projeto
        npm start
        

## Desenvolvimento dos módulos customizados

 - Módulos específicos do seu projeto deverão ser implementados da seguinte forma:
  - **0** Dentro da raiz deste projeto, navegar até o diretório 'src'
          
          # use o comando para entrar em /src
          cd src

  - **1** Clonar skeleton ou seu projeto já existente:
          
          # use o comando para clonar o skeleton em /src/app
          git clone https://github.com/jhonnyjks/rrc-app-skeleton app

  - **2** Se for novo projeto, criar novo repositório e setar a url remota:
          
          # use o comando para direcionar sua interação para seu novo repositório
          git remote set-url origin https://github.com/SEU_USER/SEU_REPOSITORIO app

  - **3** Implementar seu projeto dentro desse repositório 'em /src/app'.

  - **4** executar o comando `npm start` para rodar o projeto:
          
          # use o comando para rodar o projeto
          npm start
  
## Demais configurações conforme padrão React
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
