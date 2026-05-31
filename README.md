# API NodeJS - Projeto P1

API REST desenvolvida com Node.js, Express e TypeORM usando TypeScript.

## Tecnologias

- Node.js 22
- Express
- TypeScript
- TypeORM
- MySQL

## Diagrama do Banco de Dados

- **situations** (id, nameSituation, createdAt, updatedAt)
- **users** (id, name, email, situationId, createdAt, updatedAt)
- **product_categories** (id, name, createdAt, updatedAt)
- **product_situations** (id, name, createdAt, updatedAt)
- **products** (id, name, productSituationId, productCategoryId, createdAt, updatedAt)

## Requisitos

- Node.js 22 ou superior - Conferir a versão: `node -v`
- MySQL 8 ou superior - Conferir a versão: `mysql --version`

## Como rodar o projeto


### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Duplicar o arquivo `.env.example` e renomear para `.env`. Alterar as credenciais do banco de dados:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=nodeapi
PORT=8080
```

### 3. Criar o banco de dados no MySQL

```sql
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Compilar e rodar o projeto

```bash
npm run start:watch
```

### 5. Executar as migrations

```bash
npx typeorm migration:run -d dist/data-source.js
```

### 6. Executar as seeds

```bash
node dist/run-seeds.js
```

## Endpoints da API

Base URL: `http://localhost:8080/api`

### Situations
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/situations | Listar todas (paginado) |
| GET | /api/situations/:id | Buscar por ID |
| POST | /api/situations | Criar nova |
| PUT | /api/situations/:id | Atualizar |
| DELETE | /api/situations/:id | Deletar |

### Users
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/users | Listar todos (paginado) |
| GET | /api/users/:id | Buscar por ID |
| POST | /api/users | Criar novo |
| PUT | /api/users/:id | Atualizar |
| DELETE | /api/users/:id | Deletar |

### Product Categories
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/product-categories | Listar todas (paginado) |
| GET | /api/product-categories/:id | Buscar por ID |
| POST | /api/product-categories | Criar nova |
| PUT | /api/product-categories/:id | Atualizar |
| DELETE | /api/product-categories/:id | Deletar |

### Product Situations
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/product-situations | Listar todas (paginado) |
| GET | /api/product-situations/:id | Buscar por ID |
| POST | /api/product-situations | Criar nova |
| PUT | /api/product-situations/:id | Atualizar |
| DELETE | /api/product-situations/:id | Deletar |

### Products
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/products | Listar todos (paginado) |
| GET | /api/products/:id | Buscar por ID |
| POST | /api/products | Criar novo |
| PUT | /api/products/:id | Atualizar |
| DELETE | /api/products/:id | Deletar |

### Paginação

Todas as rotas GET de listagem aceitam os parâmetros `page` e `limit`:

```
GET /api/users?page=1&limit=5
```

## Estrutura do Projeto

```
src/
├── controllers/        # Controllers das rotas
├── entities/           # Entidades do TypeORM
├── migration/          # Migrations do banco de dados
├── routes/             # Definição das rotas
├── seeds/              # Seeds para popular o banco
├── services/           # Lógica de negócio e paginação
├── data-source.ts      # Configuração do TypeORM
├── index.ts            # Entry point da aplicação
└── run-seeds.ts        # Script para executar seeds
```
