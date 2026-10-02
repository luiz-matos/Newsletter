# 📰 Edu News

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma 7">
  <img src="https://img.shields.io/badge/PostgreSQL-Banco-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Banco">
  <img src="https://img.shields.io/badge/Stripe-Assinaturas-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe Assinaturas">
  <img src="https://img.shields.io/badge/NextAuth-GitHub-181717?style=for-the-badge&logo=github" alt="NextAuth GitHub">
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow?style=for-the-badge" alt="Licença MIT">
</div>

<br>

> 🎯 **Site de assinatura de uma newsletter sobre React**, feito com Next.js, TypeScript, Stripe, login com GitHub e Postgres.

Fiz o projeto em 2022, estudando Next.js, e ele parou na página inicial: o login não funcionava e o botão de assinar não fazia nada. Em 2026 voltei a ele para terminar o fluxo de assinatura, trocar o banco, porque o FaunaDB foi desligado, e atualizar tudo para o Next 16.

## 📋 Índice

- [🎓 O que aprendi](#-o-que-aprendi)
- [🚀 Como rodar](#-como-rodar)
- [🧠 Decisões técnicas](#-decisões-técnicas)
- [🔄 Revisitando o projeto em 2026](#-revisitando-o-projeto-em-2026)
- [📄 Licença](#-licença)

## 🎓 O que aprendi

- **Cada página pede uma estratégia de renderização.** No cliente, para o que pode carregar depois; no servidor, para o que depende de quem acessa; estática, para o que é igual para todos e ganha desempenho e indexação. As três aparecem aqui: a home e a prévia são estáticas, o post completo é renderizado no servidor e o botão de login lê a sessão no cliente.
- **Nenhuma informação está segura no front-end.** Para o que é sensível, a pasta `pages/api` funciona como um back-end: cada arquivo vira uma rota que roda no servidor, e é ali que ficam as chaves do Stripe.
- **Serviço pronto encurta o caminho.** O Stripe é um sistema de pagamento completo, com modo de teste e documentação fácil de seguir, e o login com GitHub dá um acesso simples e seguro, sem guardar senha.
- **Banco em serverless tem outra conta, e serviço externo pode sumir.** Abrir conexão com um banco tradicional a cada requisição custa caro, por isso usei em 2022 o FaunaDB, acessado por HTTP. Em 2025 ele foi desligado, e o projeto precisou de outro banco.
- **Quem confirma o pagamento é o webhook, não a página de sucesso.** O usuário pode fechar a aba antes de voltar do checkout, ou chegar na página sem pagar. A assinatura é gravada quando o Stripe avisa, e a rota busca no Stripe o estado atual em vez de confiar no evento.
- **Configuração errada falha em silêncio.** O login com GitHub nunca funcionou porque o `clientSecret` recebia a variável errada. Hoje o `requireEnv` diz qual variável falta, em vez de uma falha genérica.

## 🚀 Como rodar

Precisa de Node 20.9 ou mais novo, Yarn, um Postgres, uma conta do Stripe em modo de teste e um app OAuth do GitHub. Copie o `.env.example` para `.env.local` e preencha as variáveis; o `STRIPE_PRICE_ID` é o id de um preço recorrente criado no painel do Stripe.

```bash
yarn                                                            # dependências e client do Prisma
yarn db:migrate                                                 # cria as tabelas
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # em outro terminal; mostra o STRIPE_WEBHOOK_SECRET
yarn dev                                                        # app em http://localhost:3000
```

No checkout de teste, o cartão `4242 4242 4242 4242` com qualquer data futura aprova o pagamento.

## 🧠 Decisões técnicas

| Decisão | Alternativa | Por quê |
|---|---|---|
| Postgres com Prisma 7 | FaunaDB | O FaunaDB foi desligado; o schema fica versionado, e o adapter do `pg` permite trocar para um Postgres serverless sem mudar o código |
| Assinatura gravada pelo webhook | Gravar no retorno do checkout | A página de sucesso não prova o pagamento, e buscar o estado no Stripe protege contra eventos fora de ordem |
| Posts em Markdown no repositório | Prismic, como no curso | Roda sem mais uma conta externa e os posts ficam versionados; o custo é publicar exigir um commit |
| Pages Router no Next 16 | Migrar para o App Router | Continua suportado, e é nele que aparecem os conceitos que estudei |
| TypeScript em modo strict | Modo padrão | Pegou nulos que passavam, como o `unit_amount` do preço |

## 🔄 Revisitando o projeto em 2026

A análise encontrou o login quebrado, o botão de assinar sem ação e metade do fluxo de assinatura por fazer. Dos 7 bugs corrigidos, os principais:

| O que estava errado | O que mudou |
|---|---|
| O login com GitHub falhava, com o `clientSecret` recebendo o `NEXTAUTH_SECRET` | Passa a usar o `GITHUB_SECRET` |
| Preço no formato do servidor, com o locale `pr-br`, que não existe | Locale `pt-BR` |
| O build quebrava fora da minha conta do Stripe | O id do preço saiu do código para a variável `STRIPE_PRICE_ID` |
| Os links do header recarregavam a home | `ActiveLink` com o caminho atual |
| A home estourava a largura no celular | A imagem fica escondida abaixo de 720 px |

## 📄 Licença

[MIT](LICENSE)

---

<div align="center">
  <p>Desenvolvido por <strong>Luiz Matos</strong></p>
  <p>
    <a href="https://github.com/luiz-matos">GitHub</a> •
    <a href="https://www.linkedin.com/in/luizeduardomatos/">LinkedIn</a>
  </p>
</div>
