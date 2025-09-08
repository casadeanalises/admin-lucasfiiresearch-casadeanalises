# Configuração do Clerk no Sistema Admin

## Resumo
O sistema agora suporta **dois métodos de autenticação**:
1. **Sistema tradicional** - Login com email/senha armazenado no MongoDB
2. **Clerk** - Sistema de autenticação moderno com recursos avançados

## Como configurar o Clerk

### 1. Criar conta no Clerk
1. Acesse [clerk.com](https://clerk.com)
2. Crie uma conta gratuita
3. Crie um novo projeto/aplicação

### 2. Configurar Google OAuth
No dashboard do Clerk:
1. Vá para "SSO Connections" ou "Social Providers"
2. Clique em "Google"
3. Configure o Google OAuth:
   - Vá para [Google Cloud Console](https://console.cloud.google.com)
   - Crie um projeto ou selecione um existente
   - Ative a "Google+ API"
   - Crie credenciais OAuth 2.0:
     - Client ID
     - Client Secret
   - Configure URLs de redirecionamento:
     - `https://your-domain.clerk.accounts.dev/v1/oauth_callback`
4. Cole as credenciais no Clerk

### 3. Obter as chaves de API
No dashboard do Clerk:
1. Vá para "API Keys"
2. Copie a `Publishable Key` e `Secret Key`

### 4. Configurar variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Configurações do Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# URLs do Clerk para admin
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/clerk-login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/clerk-register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Chave JWT existente (manter)
JWT_SECRET=sua-chave-super-secreta-e-unica-123
```

### 5. Configurar usuários no Clerk
1. No dashboard do Clerk, vá para "Users"
2. Adicione os emails dos administradores
3. Configure roles/permissions se necessário

## Como usar

### ✨ Página inicial (/) - NOVO!
**Duas opções de login na mesma página:**

1. **Login tradicional** (formulário):
   - Digite email/senha configurados no MongoDB
   - Sistema continua funcionando como antes

2. **Login com Google** (botão):
   - Clique em "Entrar com Google"
   - Use sua conta Google configurada no Clerk
   - Redireciona automaticamente para `/admin`

### Opção 2: Login avançado com Clerk
- Acesse `/admin/clerk-login` (modal completo)
- Use email/senha + recursos como 2FA
- Suporte a múltiplos provedores sociais

### Opção 3: Registro com Clerk
- Acesse `/admin/clerk-register`
- Crie nova conta diretamente no Clerk

## Fluxo de autenticação

### ✅ Login bem-sucedido:
- **Qualquer método** → Redireciona para `/admin`
- Sistema detecta automaticamente o tipo de autenticação
- Interface mostra "(Clerk)" ou "(Sistema)" no header

### ✅ Logout:
- **Qualquer método** → Volta para `/` (página inicial)
- Sessão limpa automaticamente
- Usuário pode escolher novo método de login

## Recursos disponíveis

### Com sistema tradicional:
- ✅ Login básico com email/senha
- ✅ Gerenciamento de sessão
- ✅ Logout

### Com Clerk (adicional):
- ✅ Login com email/senha
- ✅ Autenticação de dois fatores (2FA)
- ✅ Login social (Google, GitHub, etc.)
- ✅ Reset de senha automático
- ✅ Interface moderna
- ✅ Segurança avançada
- ✅ Auditoria e logs

## Interface do usuário

O componente `AdminInfo` agora mostra:
- Email do usuário logado
- Tipo de autenticação: "(Clerk)" ou "(Sistema)"
- Botão de logout apropriado para cada sistema

## Migração gradual

Você pode:
1. **Manter apenas o sistema atual** - não configure o Clerk
2. **Usar ambos sistemas** - configure o Clerk para usuários específicos
3. **Migrar completamente** - configure todos os usuários no Clerk

## Troubleshooting

### Erro "Module not found @clerk/nextjs"
- Verifique se executou: `npm install @clerk/nextjs`

### Clerk não funciona
- Verifique as variáveis de ambiente no `.env.local`
- Confirme as chaves no dashboard do Clerk
- Verifique se o domínio está configurado no Clerk

### Sistema tradicional para de funcionar
- O sistema tradicional continua funcionando independentemente
- Verifique as credenciais no MongoDB
- Verifique a chave `JWT_SECRET`

## Suporte

O sistema foi configurado para ser **compatível com ambos**, então você pode:
- Usar apenas o sistema tradicional (sem configurar Clerk)
- Usar apenas Clerk (depois de migrar usuários)
- Usar ambos simultaneamente (recomendado para transição)
