<div align="center">
  <img src="./docs/lucasfii_banner_logo.png" alt="CasaDeAnálises Banner" width="100%" />

# Lucas FII Research - CasaDeAnálises 📊

 <!-- <p align="center">
    Plataforma profissional de análise de Fundos Imobiliários
    <br />
    <a href="https://casadeanalises.com.br"><strong>www.casadeanalises.com.br »</strong></a>
    <br />
    <br />
    <a href="https://youtube.com/@lucasfiis">YouTube</a>
    ·
    <a href="https://github.com/DevRocha">GitHub</a>
    ·
    <a href="https://lucasfii.com.br">Website</a>
  </p> -->

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8)


</div>

---

First, run the development server:

### Instalação

```bash
npm ci
# or
npm install
```

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🔍 Funcionalidades Principais

- 📊 Dashboard interativo
- 📈 Análise de FIIs
- 💰 Sistema de assinatura
- 📱 Design responsivo
- 🔒 Autenticação segura
- 📄 Relatórios detalhados

## 🧪 Testes

```bash
# Execute os testes unitários
pnpm test

# Execute os testes e2e
pnpm test:e2e
```

## 📦 Deploy

O projeto está configurado para deploy na Vercel:

```bash
pnpm build
vercel deploy
```

## 🔐 Segurança

- Autenticação gerenciada pelo Clerk
- Pagamentos processados pelo Stripe
- Dados sensíveis protegidos por variáveis de ambiente
- HTTPS forçado em produção

## 🛠 Tecnologias e Bibliotecas

### Core

- [Next.js 14](https://nextjs.org/) - Framework React com SSR
- [React](https://reactjs.org/) - Biblioteca JavaScript para UI
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript tipado
- [Node.js](https://nodejs.org/) - Runtime JavaScript

### Estilização

- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes reutilizáveis
- [Lucide Icons](https://lucide.dev/) - Ícones modernos
- [AOS](https://michalsnik.github.io/aos/) - Animate On Scroll

### Banco de Dados

- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Prisma](https://www.prisma.io/) - ORM para Node.js e TypeScript

### Autenticação e Pagamentos

- [Clerk](https://clerk.dev/) - Autenticação e gerenciamento de usuários
- [Stripe](https://stripe.com/) - Processamento de pagamentos

### Desenvolvimento

- [ESLint](https://eslint.org/) - Linter JavaScript/TypeScript
- [Prettier](https://prettier.io/) - Formatador de código
- [Axios](https://axios-http.com/) - Cliente HTTP
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [Zod](https://zod.dev/) - Validação de schema TypeScript

`
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── .husky
    ├── commit-msg
    └── pre-commit
├── .lintstagedrc.json
├── .prettierrc.json
├── README.md
├── app
    ├── (home)
    │   └── page.tsx
    ├── _actions
    │   └── upsert-transaction
    │   │   ├── index.ts
    │   │   └── schema.ts
    ├── _components
    │   ├── add-transaction-button.tsx
    │   ├── footer.tsx
    │   ├── money-input.tsx
    │   ├── navbar.tsx
    │   ├── ui
    │   │   ├── alert-dialog.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── chart.tsx
    │   │   ├── data-table.tsx
    │   │   ├── date-picker.tsx
    │   │   ├── dialog.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── sonner.tsx
    │   │   ├── table.tsx
    │   │   └── tooltip.tsx
    │   └── upsert-transaction-dialog.tsx
    ├── _constants
    │   └── transactions.ts
    ├── _data
    │   ├── can-user-add-transaction
    │   │   └── index.ts
    │   ├── get-current-month-transactions
    │   │   └── index.ts
    │   └── get-dashboard
    │   │   ├── index.ts
    │   │   └── types.ts
    ├── _lib
    │   ├── prisma.ts
    │   └── utils.ts
    ├── _utils
    │   └── currency.ts
    ├── api
    │   ├── webhook
    │   │   └── route.ts
    │   └── webhooks
    │   │   └── stripe
    │   │       └── route.ts
    ├── dashboard
    │   ├── _actions
    │   │   └── generate-ai-report
    │   │   │   ├── index.ts
    │   │   │   └── schema.ts
    │   ├── _components
    │   │   ├── ai-report-button.tsx
    │   │   ├── expenses-per-category.tsx
    │   │   ├── last-transactions.tsx
    │   │   ├── percentage-item.tsx
    │   │   ├── summary-card.tsx
    │   │   ├── summary-cards.tsx
    │   │   ├── time-select.tsx
    │   │   └── transactions-pie-chart.tsx
    │   └── page.tsx
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    ├── reports
    │   ├── _actions
    │   │   └── delete-transaction
    │   │   │   ├── index.ts
    │   │   │   └── schema.ts
    │   ├── _columns
    │   │   └── index.tsx
    │   ├── _components
    │   │   ├── delete-transaction-button.tsx
    │   │   ├── edit-transaction-button.tsx
    │   │   └── type-badge.tsx
    │   └── page.tsx
    ├── subscription
    │   ├── _actions
    │   │   └── create-stripe-checkout
    │   │   │   └── index.ts
    │   ├── _components
    │   │   ├── acquire-plan-button.tsx
    │   │   └── subscription-toast.tsx
    │   └── page.tsx
    └── webhook
    │   └── route.ts
├── components.json
├── docker-compose.yml
├── middleware.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
    ├── migrations
    │   ├── 20241030145404_init_db
    │   │   └── migration.sql
    │   ├── 20241030180457_add_user_id_to_transaction
    │   │   └── migration.sql
    │   └── migration_lock.toml
    └── schema.prisma
├── public
    ├── bank-slip.svg
    ├── bank-transfer.svg
    ├── credit-card.svg
    ├── debit-card.svg
    ├── file.svg
    ├── globe.svg
    ├── login.png
    ├── logo.svg
    ├── money.svg
    ├── next.svg
    ├── other.svg
    ├── pix.svg
    ├── vercel.svg
    └── window.svg
├── tailwind.config.ts
└── tsconfig.json
`

### Hospedagem e Deploy

- [Vercel](https://vercel.com/) - Plataforma de hospedagem
- [PlanetScale](https://planetscale.com/) - Banco de dados serverless

### Ferramentas de Desenvolvimento

- [pnpm](https://pnpm.io/) - Gerenciador de pacotes
- [Git](https://git-scm.com/) - Controle de versão

## 👥 Contribuição & Desenvolvedor

### Desenvolvedor Principal

- **(DevRocha)**

  - Website: [devrocha.com.br](https://www.devrocha.com.br)
  - GitHub: [github.com/DevRocha](https://github.com/devrocha-oficial)
  - LinkedIn: [linkedin.com/in/DevRocha](https://www.linkedin.com/company/DevRocha/)

- **Alan Rocha**

  - Portfolio: [alanrocha.vercel.app](https://alanrocha.vercel.app)
  - GitHub: [github.com/AlanRocha](https://github.com/alanrochagomes)
  - LinkedIn: [linkedin.com/in/AlanRocha](https://www.linkedin.com/in/alan-rocha-gomes/)

  Desenvolvido por DevRocha

### Repositório do Projeto

- GitHub: [github.com/DevRocha/casadeanalises-lucasfii](https://github.com/alanrochagomes/casadeanalises-lucasfii)


## Configuração do Ambiente

### Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as seguintes variáveis no arquivo `.env`:

- `MONGODB_URI`: URL de conexão com o MongoDB
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Chave pública do Clerk (autenticação)
- `CLERK_SECRET_KEY`: Chave secreta do Clerk
- `NEXT_PUBLIC_API_BASE_URL`: URL base da API (http://localhost:3000 para desenvolvimento)
- `ADMIN_EMAIL`: Email do administrador do sistema



- ## 📝 Licença

© 2025 Lucas FII Research L&L Consultoria Financeira. Todos os direitos reservados.
