# 🏠 Lucas FII Research - Casa de Análises | ADMINISTRATIVO


Sistema administrativo completo para gerenciamento de conteúdo educacional e financeiro da plataforma Lucas FII Research.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Sistema Admin](#-sistema-admin)
- [APIs](#-apis)
- [Autenticação](#-autenticação)
- [Banco de Dados](#-banco-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O **Casa de Análises** é um painel administrativo moderno desenvolvido em Next.js 14 para gerenciar todo o conteúdo da plataforma Lucas FII Research. O sistema oferece uma interface intuitiva e responsiva para administradores gerenciarem:

- 📊 **Relatórios Semanais** (PDFs e Vídeos)
- 📰 **Notificações** do sistema
- 📚 **Material Educacional** 
- 🎥 **Vídeos** (YouTube/Vimeo)
- 📄 **PDFs** de análises
- 📈 **ETFs** e **Low Cost** investments
- 📅 **Cronogramas de Atualização**
- 👥 **Usuários Administradores**

## 🛠 Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **Radix UI** - Componentes acessíveis
- **React Hot Toast** - Sistema de notificações

### Backend
- **Next.js API Routes** - API serverless
- **MongoDB** - Banco de dados NoSQL
- **Prisma** - ORM para MongoDB
- **JWT** - Autenticação com tokens
- **bcryptjs** - Hash de senhas

### Ferramentas
- **ESLint** - Linter de código
- **Prettier** - Formatador de código
- **Husky** - Git hooks
- **Docker** - Containerização

## 📋 Pré-requisitos

- **Node.js** 18.17 ou superior
- **npm** ou **yarn**
- **MongoDB** (local ou Atlas)
- **Git**

## 🚀 Instalação

1.  **Instale as dependências**
```bash
npm install
# ou
yarn install
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

3. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env.local)

```env
# Banco de Dados
DATABASE_URL="mongodb://localhost:27017"
# ou para MongoDB Atlas:
# DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net"

# JWT
JWT_SECRET="seu-jwt-secret-super-seguro"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-nextauth-secret"

# APIs Externas (opcional)
YOUTUBE_API_KEY="sua-youtube-api-key"
VIMEO_ACCESS_TOKEN="seu-vimeo-token"
```

### Configuração do MongoDB

O projeto usa **MongoDB** como banco principal com as seguintes coleções:

- `etf_pdfs` - PDFs de ETFs
- `etf_videos` - Vídeos de ETFs  
- `lowcost_pdfs` - PDFs Low Cost
- `lowcost_videos` - Vídeos Low Cost
- `home_videos` - Vídeos do Teses de Investimento
- `reports` - Relatórios semanais
- `notifications` - Notificações do sistema
- `educational` - Material educacional
- `relevant_facts` - Fatos relevantes
- `update_schedule` - Cronogramas
- `admins` - Administradores

## ▶️ Executando o Projeto

### Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

Acesse: `http://localhost:3000`

### Produção
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

### Docker
```bash
docker-compose up -d
```

## 📁 Estrutura do Projeto

```
admin-lucasfiiresearch-casadeanalises/
├── app/                          # App Router (Next.js 14)
│   ├── admin/                    # Páginas administrativas
│   │   ├── notifications/        # Gerenciar notificações
│   │   ├── reports/              # Relatórios semanais
│   │   ├── etf-videos/           # ETFs (PDFs + Vídeos)
│   │   ├── lowcost-videos/       # Low Cost (PDFs + Vídeos)
│   │   ├── home-videos/          # Vídeos da home
│   │   ├── educational/          # Material educacional
│   │   ├── relevant-facts/       # Fatos relevantes
│   │   ├── update-schedule/      # Cronogramas
│   │   └── admins/               # Gerenciar admins
│   ├── api/                      # API Routes
│   │   ├── admin/                # APIs de administração
│   │   ├── notifications/        # APIs de notificações
│   │   ├── etf-pdfs/             # APIs de ETFs PDFs
│   │   ├── etf-videos/           # APIs de ETFs Vídeos
│   │   └── ...                   # Outras APIs
│   ├── _components/              # Componentes globais
│   ├── _lib/                     # Utilitários
│   └── _models/                  # Modelos TypeScript
├── lib/                          # Bibliotecas e configurações
│   ├── auth.ts                   # Autenticação JWT
│   ├── auth-admin.ts             # Auth específica para admin
│   ├── mongodb.ts                # Conexão MongoDB
│   └── prisma.ts                 # Cliente Prisma
├── prisma/                       # Schema do banco
│   └── schema.prisma             # Modelos Prisma
├── public/                       # Arquivos estáticos
└── docs/                         # Documentação
```

## 🔐 Sistema Admin

### Autenticação
- **JWT Tokens** para sessões seguras
- **Cookies httpOnly** para armazenamento
- **Middleware** de proteção de rotas
- **Hash bcrypt** para senhas

### Painel Principal
O dashboard admin oferece acesso a:

1. **📊 Relatório Semanal** - Gerenciar PDFs e vídeos semanais
2. **🔔 Notificações** - Sistema de notificações push
3. **📚 Material Educacional** - Artigos e conteúdo educativo
4. **🎥 Vídeos** - Gerenciar vídeos YouTube/Vimeo
5. **📄 PDFs** - Upload e gerenciamento de documentos
6. **📈 ETFs** - Conteúdo específico de ETFs
7. **💰 Low Cost** - Investimentos de baixo custo
8. **📅 Cronogramas** - Agendamento de conteúdo
9. **👥 Administradores** - Gerenciar usuários admin

### Interface
- **Design Glassmorphism** - Visual moderno e profissional
- **Responsivo** - Funciona em mobile, tablet e desktop
- **Tema Azul** - Cor principal #1f40af
- **Componentes Reutilizáveis** - Shadcn/ui + Radix UI
- **Toast Notifications** - Feedback visual para ações

## 🔌 APIs

### Estrutura das APIs

Todas as APIs seguem o padrão RESTful:

```
GET    /api/[resource]           # Listar recursos
POST   /api/[resource]           # Criar recurso
PUT    /api/[resource]           # Atualizar recurso
DELETE /api/[resource]/[id]      # Excluir recurso
```

### Principais Endpoints

#### 📊 Relatórios
```typescript
GET    /api/reports              # Listar relatórios
POST   /api/reports              # Criar relatório
PUT    /api/reports              # Atualizar relatório
DELETE /api/reports/[id]         # Excluir relatório

GET    /api/reports/pdfs         # Listar PDFs
POST   /api/reports/pdfs         # Criar PDF
PUT    /api/reports/pdfs         # Atualizar PDF
DELETE /api/reports/pdfs/[id]    # Excluir PDF

GET    /api/reports/videos       # Listar vídeos
POST   /api/reports/videos       # Criar vídeo
PUT    /api/reports/videos       # Atualizar vídeo
DELETE /api/reports/videos/[id]  # Excluir vídeo
```

#### 🔔 Notificações
```typescript
GET    /api/notifications        # Listar notificações
POST   /api/notifications        # Criar notificação
PUT    /api/notifications/[id]   # Atualizar notificação
DELETE /api/notifications/[id]   # Excluir notificação
DELETE /api/notifications        # Excluir todas
```

#### 📈 ETFs
```typescript
GET    /api/etf-pdfs             # Listar PDFs de ETFs
POST   /api/etf-pdfs             # Criar PDF de ETF
PUT    /api/etf-pdfs             # Atualizar PDF de ETF
DELETE /api/etf-pdfs/[id]        # Excluir PDF de ETF

GET    /api/etf-videos           # Listar vídeos de ETFs
POST   /api/etf-videos           # Criar vídeo de ETF
PUT    /api/etf-videos           # Atualizar vídeo de ETF
DELETE /api/etf-videos/[id]      # Excluir vídeo de ETF
```

#### 👥 Administradores
```typescript
GET    /api/admin/list           # Listar admins
POST   /api/admin/create         # Criar admin
PUT    /api/admin/update/[id]    # Atualizar admin
DELETE /api/admin/delete/[id]    # Excluir admin
POST   /api/admin/login          # Login admin
POST   /api/admin/logout         # Logout admin
```

### Autenticação de APIs

Todas as APIs administrativas requerem autenticação:

```typescript
// Headers obrigatórios
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}

// Ou via cookie
{
  "Cookie": "admin_token=<jwt-token>"
}
```

### Estrutura de Resposta

```typescript
// Sucesso
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}

// Erro
{
  "success": false,
  "error": "Mensagem de erro",
  "code": "ERROR_CODE"
}
```

## 🔐 Autenticação

### Sistema de Login

1. **Credenciais** - Email e senha
2. **Validação** - Verificação no banco de dados
3. **JWT Token** - Geração de token seguro
4. **Cookie** - Armazenamento httpOnly
5. **Middleware** - Proteção de rotas

### Fluxo de Autenticação

```typescript
// 1. Login
POST /api/admin/login
{
  "email": "admin@lucasfii.com",
  "password": "senha123"
}

// 2. Resposta
{
  "success": true,
  "token": "jwt-token-here",
  "admin": {
    "id": "admin-id",
    "email": "admin@lucasfii.com",
    "name": "Admin Name"
  }
}

// 3. Uso do token
Authorization: Bearer jwt-token-here
```

### Middleware de Proteção

```typescript
// lib/auth-admin.ts
export async function checkAdminAuth() {
  const token = cookies().get("admin_token")?.value;
  const decoded = await verifyJWT(token);
  return { isAdmin: true, adminId: decoded.sub };
}
```

## 🗄️ Banco de Dados

### MongoDB Collections

#### 📊 Relatórios
```typescript
// reports
{
  _id: ObjectId,
  title: string,
  description: string,
  author: string,
  date: string,
  time: string,
  code: string,
  type: "pdf" | "video",
  thumbnail: string,
  premium: boolean,
  tags: string[],
  month: string,
  year: string,
  videoId?: string,
  url?: string,
  pageCount?: number,
  dividendYield?: string,
  price?: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### 🔔 Notificações
```typescript
// notifications
{
  _id: ObjectId,
  title: string,
  description: string,
  type: "video" | "pdf" | "noticia" | "anuncio" | "release",
  imageUrl: string,
  link?: string,
  global: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 📈 ETFs
```typescript
// etf_videos
{
  _id: ObjectId,
  title: string,
  description: string,
  videoId: string,
  thumbnail: string,
  active: boolean,
  order: number,
  pdfUrl?: string,
  createdAt: Date,
  updatedAt: Date
}

// etf_pdfs
{
  _id: ObjectId,
  title: string,
  description: string,
  fileUrl: string,
  pageCount: number,
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 👥 Administradores
```typescript
// admins
{
  _id: ObjectId,
  email: string,
  password: string, // hashed
  name: string,
  role: "admin" | "super_admin",
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Conexão MongoDB

```typescript
// lib/mongodb.ts
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!, {
  connectTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 20000,
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true
});

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}
```

## ⚡ Funcionalidades

### 🎨 Interface Moderna
- **Glassmorphism Design** - Visual moderno com transparências
- **Responsivo** - Funciona em todos os dispositivos
- **Tema Azul** - Cor principal #1f40af
- **Animações Suaves** - Transições fluidas
- **Componentes Reutilizáveis** - Shadcn/ui + Radix UI

### 📱 Responsividade
- **Mobile First** - Design otimizado para mobile
- **Breakpoints Customizados** - xs, sm, md, lg, xl, 2xl
- **Componentes Adaptativos** - Tabelas, formulários, cards
- **Navegação Intuitiva** - Menu responsivo

### 🔔 Sistema de Notificações
- **Toast Messages** - Feedback visual para ações
- **Posicionamento** - top-right por padrão
- **Tipos** - Sucesso, erro, aviso, info
- **Auto-dismiss** - Desaparecimento automático
- **Stack** - Múltiplas notificações empilhadas

### 📊 Gerenciamento de Conteúdo
- **CRUD Completo** - Criar, ler, atualizar, excluir
- **Upload de Arquivos** - PDFs e imagens
- **Integração YouTube** - Extração automática de IDs
- **Integração Vimeo** - Suporte a vídeos Vimeo
- **Thumbnails Automáticos** - Geração de miniaturas
- **Busca e Filtros** - Sistema de pesquisa avançada

### 🔐 Segurança
- **JWT Authentication** - Tokens seguros
- **Password Hashing** - bcrypt para senhas
- **Route Protection** - Middleware de autenticação
- **Input Validation** - Validação de dados
- **CORS** - Configuração de segurança

### 📈 Performance
- **Server-Side Rendering** - Next.js SSR
- **Static Generation** - Páginas estáticas quando possível
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Carregamento otimizado
- **Caching** - Cache de API e assets

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório** no Vercel
2. **Configure as variáveis de ambiente**
3. **Deploy automático** a cada push

```bash
# Variáveis de ambiente no Vercel
DATABASE_URL=mongodb+srv://...
JWT_SECRET=seu-jwt-secret
NEXTAUTH_URL=https://seu-dominio.vercel.app
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Variáveis de Ambiente para Produção

```env
# Produção
NODE_ENV=production
DATABASE_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/
JWT_SECRET=jwt-secret-super-seguro-para-producao
NEXTAUTH_URL=https://admin.lucasfii.com
NEXTAUTH_SECRET=nextauth-secret-para-producao

# APIs Externas
YOUTUBE_API_KEY=sua-youtube-api-key
VIMEO_ACCESS_TOKEN=seu-vimeo-token
```

### Estrutura de Commits

```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
style: formatação de código
refactor: refatoração de código
test: adicionar testes
chore: tarefas de manutenção
```

## 📄 Licença

© 2025 Lucas FII Research L&L Consultoria Financeira. Todos os direitos reservados.
