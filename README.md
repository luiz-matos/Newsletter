# Edu News

Site de assinatura de uma newsletter sobre React, feito com Next.js, TypeScript, Stripe, login com GitHub e Postgres.

Fiz o projeto em 2022, estudando Next.js, e ele parou na página inicial: o login não funcionava e o botão de assinar não fazia nada. Em 2026 voltei a ele para terminar o fluxo de assinatura, trocar o banco (o FaunaDB foi desligado) e atualizar tudo para o Next 16.

## Como rodar

Precisa de Node 20.9 ou mais novo, Yarn, um Postgres, uma conta do Stripe em modo de teste e um app OAuth do GitHub.

1. Instale as dependências. O `postinstall` já gera o client do Prisma.

```bash
yarn
```

2. Copie o `.env.example` para `.env.local` e preencha as variáveis. O `STRIPE_PRICE_ID` é o id de um preço recorrente criado no painel do Stripe.

3. Crie as tabelas no banco.

```bash
yarn db:migrate
```

4. Em outro terminal, encaminhe os eventos do Stripe para o app. O comando mostra o `STRIPE_WEBHOOK_SECRET` que vai no `.env.local`.

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

5. Suba o app e abra http://localhost:3000.

```bash
yarn dev
```

No checkout de teste, o cartão `4242 4242 4242 4242` com qualquer data futura aprova o pagamento.

## Recursos

- Login com GitHub
- Assinatura mensal pelo checkout do Stripe
- Assinatura atualizada pelo webhook do Stripe: ativação, mudança e cancelamento
- Lista de posts e post completo só para quem assina
- Prévia com os 3 primeiros blocos do texto para quem não assina
- Layout ajustado para celular

## Como o código funciona

```
content/posts/              posts em Markdown, com título e data no cabeçalho
prisma/
  schema.prisma             tabelas User e Subscription
  migrations/               SQL das migrations
src/
  components/
    ActiveLink/             link do header que destaca a página atual
    Header/
    SignInButton/           entra e sai com o GitHub
    SubscribeButton/        pede login, abre o checkout ou leva aos posts
  pages/
    index.tsx               home com o preço do plano (estática, revalida a cada 24 h)
    posts/index.tsx         lista de posts (estática)
    posts/[slug].tsx        post completo (renderizado no servidor, só para assinante)
    posts/preview/[slug].tsx  prévia (estática, revalida a cada 1 h)
    api/auth/[...nextauth].ts login e sessão
    api/subscribe.ts        cria o cliente no Stripe e a sessão de checkout
    api/webhooks/stripe.ts  recebe os eventos de assinatura
  services/
    env.ts                  leitura das variáveis obrigatórias
    posts.ts                leitura e conversão dos posts
    prisma.ts               client do banco
    stripe.ts               client do Stripe
    subscriptions.ts        grava no banco o estado atual de uma assinatura
```

- **Login.** O next-auth autentica pelo GitHub. No `signIn`, o usuário é criado ou atualizado pelo e-mail. No `session`, a sessão ganha o campo `activeSubscription`, consultado no banco.
- **Checkout.** O botão chama `POST /api/subscribe`. A rota cria o cliente no Stripe só na primeira vez, guarda o id em `User.stripeCustomerId` e devolve a URL do checkout.
- **Webhook.** O Stripe avisa `checkout.session.completed` e as mudanças da assinatura. A rota confere a assinatura do evento e chama `saveSubscription`, que busca a assinatura no Stripe e grava o status no banco.
- **Posts.** A prévia é gerada no build, igual para todo mundo. O post completo passa pelo servidor a cada acesso para conferir a sessão, e quem não assina é redirecionado para a prévia.

## O que aprendi em 2022

**Renderização no Next.** Existem três estratégias principais:

- Client-side rendering: para conteúdo que pode carregar depois que a página já está na tela.
- Server-side rendering: para páginas que precisam dos dados já no carregamento, principalmente as que dependem de quem está acessando.
- Static Site Generation: para páginas iguais para todos os usuários, que ganham desempenho e indexação. Não serve para conteúdo personalizado, porque todo mundo recebe a mesma página.

Neste projeto as três aparecem: a home e a prévia são estáticas, o post completo é renderizado no servidor e o botão de login lê a sessão no cliente.

**Segurança.** Nenhuma informação está segura no front-end. Para o que é sensível, a pasta `pages/api` funciona como um back-end: cada arquivo que exporta uma função vira uma rota que roda no servidor. É ali que ficam as chaves do Stripe.

**Rotas com parâmetro.** Colchetes no nome do arquivo (`[slug].tsx`) recebem um parâmetro da URL. Com reticências (`[...nextauth].ts`), a rota recebe todo o resto do caminho.

**Sass.** Pré-processador de CSS. Com a biblioteca instalada, o Next processa os arquivos `.scss` sem configuração.

**Stripe.** Sistema de pagamento completo, com modo de teste e documentação fácil de seguir.

**Login social com GitHub.** Basta cadastrar a aplicação nas opções de desenvolvedor do GitHub para ter um login simples e seguro, sem guardar senha.

**Banco em ambiente serverless.** Em serverless, abrir uma conexão com um banco tradicional a cada requisição custa caro. Por isso usei o FaunaDB, um banco acessado por HTTP. O DynamoDB seria outra opção.

## Revisitando o projeto em 2026

A análise encontrou o login quebrado, o botão de assinar sem ação e metade do fluxo de assinatura por fazer.

### Bugs corrigidos

| Bug | Causa | Correção |
|---|---|---|
| Login com GitHub falhava | `clientSecret` recebia o `NEXTAUTH_SECRET` | Passa a usar o `GITHUB_SECRET` |
| Preço no formato do servidor (ex.: `R$9.90`) | Locale `pr-br`, que não existe | Locale `pt-BR` |
| Build quebrava fora da minha conta do Stripe | Id do preço fixo no código | Variável `STRIPE_PRICE_ID` |
| Fonte Poppins nunca aparecia | O CSS pedia `Roboto` | CSS usa `Poppins` |
| Botão de login vazio | Usuário do GitHub sem nome cadastrado | Mostra o e-mail no lugar |
| Links do header recarregavam a home | `href=""` e "Home" sempre ativo | `ActiveLink` com o caminho atual |
| Home estourava a largura no celular | Imagem de 336 px ao lado do texto | Imagem escondida abaixo de 720 px |

### Decisões técnicas

**Postgres com Prisma no lugar do FaunaDB**

O FaunaDB foi desligado em 2025. Escolhi Postgres com Prisma 7:

- O schema fica versionado junto do código, com migrations em SQL.
- O client é tipado a partir do schema.
- O Prisma 7 conecta pelo adapter do `pg`, o que permite trocar para um Postgres serverless (Neon, Supabase) sem mudar o código.

**Assinatura pelo webhook, não pelo retorno do checkout**

A página de sucesso do checkout não prova que o pagamento aconteceu: o usuário pode fechar a aba antes, ou chegar nela sem pagar. Quem registra a assinatura é o webhook:

- O evento é assinado pelo Stripe e a rota confere essa assinatura sobre o corpo cru da requisição.
- A rota não confia no conteúdo do evento: busca a assinatura no Stripe e grava o estado atual. Assim, eventos fora de ordem não deixam o banco errado.

**Posts em Markdown no lugar de um CMS**

A versão original do curso usava o Prismic. Preferi arquivos Markdown no repositório: o projeto roda sem mais uma conta externa e os posts ficam versionados. O custo é que publicar um post exige um commit.

**Pages Router mantido no Next 16**

Atualizei do Next 12 para o 16 sem migrar para o App Router. O Pages Router continua suportado, e é nele que aparecem os conceitos que estudei (`getStaticProps`, `getServerSideProps`, `pages/api`).

**Organização do código**

- **Serviços separados das páginas.** Stripe, Prisma, posts e assinaturas ficam em `src/services`, e as páginas só chamam funções.
- **TypeScript em modo strict.** Pegou nulos que antes passavam, como o `unit_amount` do preço e o `params` das rotas.
- **Variáveis obrigatórias com `requireEnv`.** Se faltar uma variável, o erro diz qual é, em vez de uma falha genérica do Stripe ou do GitHub.
