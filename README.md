# Digital Store API

## Descrição

Este projeto é uma API para um sistema de loja digital. Ele fornece endpoints para gerenciar produtos, categorias e usuários. Desenvolvido com Node.js, Express e Sequelize.

## Requisitos

- Node.js
- MySQL ou MariaDB
- NPM ou Yarn

## Instalação

1. **Clone o repositório**

   ```bash
   git clone (https://github.com/marcelly-ramos/projeto-backend/tree/master)

2. **Instale as dependências**

   ```bash
   npm install

4. **Configure as variáveis de ambiente**

- Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

  DB_NAME=digital_store_db
  DB_USER=root
  DB_PASSWORD=null
  DB_HOST=127.0.0.1
  DB_PORT=3306

  JWT_SECRET=admin123

5. **Execute as migrações**

    ```bash
    npx sequelize-cli db:migrate
    
6. **Inicie o servidor**

   ```bash
   npm start

# Endpoints

- Usuários
    - GET /v1/user/:id - Obter usuário por ID
    - POST /v1/user - Criar um novo usuário
    - PUT /v1/user/:id - Atualizar usuário
    - DELETE /v1/user/:id - Deletar usuário
 
- Produtos
    -  GET /v1/product/search - Buscar produtos
    -  GET /v1/product/:id - Obter produto por ID
    -  POST /v1/product - Criar um novo produto
    -  PUT /v1/product/:id - Atualizar produto
    -  DELETE /v1/product/:id - Deletar produto

- Categorias
    - GET /v1/category - Obter todas as categorias
    - GET /v1/category/:id - Obter categoria por ID
    - POST /v1/category - Criar uma nova categoria
    - PUT /v1/category/:id - Atualizar categoria
    - DELETE /v1/category/:id - Deletar categoria



