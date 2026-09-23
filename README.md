# Edu News

Um site de venda de assinatura de new letter onde você recebe as notícias mais importantes do dia em forma de email, utilizando autenticação do Github e um sistema de pagamento fake com Stripe.

## Ferramentas Utilizadas

* Typescript
* NextJS
* SASS
* Stripe
* Github OAuth
* FaunaDB

## Aprendizados

### Next
- No Next existem 3 tipos principais de renderização:
  - Client-side render: Deve ser utilizado quando o conteúdo do componente pode ser carregado depois que a página está em tela do usuário
  - Server side render: Para páginas que precisam de indexação para motores de busca, quando a página precisa dos dados para mostrar em tela no momento do carregamento, em páginas que não necessitam de indexação para motores de busca ou onde requisições que necessitam de mais tempo para processar, vale a pena o seu uso para aumentar a performance.
  - Static Site Generation: Uma estratégia para melhorar performance para páginas que serão as mesmas para todos os usuários e que necessitam de indexação para motores de busca, tomando cuidado sempre para páginas que são dinâmicas com dados personalizados para cada usuário, pois perderá o efeito e mostrará a mesma página independente do usuário.

- Segurança: NUNCA uma informação está segura no Frontend, independente da estratégia. Porém, em alguns momentos, podemos utilizar a camada do next como se fosse um Backend. Criando arquivos dentro da pasta pages/api, exportando uma função, automaticamente vira uma rota para a camada do Next.

- Rotas com parâmetro: Ao criar uma pasta dentro de pages/api, o arquivo com nome "index" será chamado na rota padrão e utilizando colchetes"[]" nos nomes dos arquivos, você consegue utilizar parâmetros vindos da rota. Outra forma mais dinâmica é o uso do spread operator no nome do arquivo, onde toda a rota é enviada como parâmetro para a requisição.

### SASS
Pré processador de css muito dinâmico, utilizando a biblioteca de sass, o processamento fica implícito.

### Stripe
Um sistema de pagamento completo, com muitas opções de teste para integrar e documentação fácil de entender.

### Login social - Github
Cadastrando a aplicação nas opções de desenvolvedor dentro do Github, você consegue utilizar o login social, que é simples e seguro para utilizar como forma de login e gerenciamento de usuário.

### FaunaDB
No caso de um projeto Serverless, as conexões com o banco de dados convencional, fica extremamente custoso conectar ao banco de dados cada vez que for fazer uma requisição. Para melhorar essa performance, utilizaremos um banco de dados não relacional, muito mais dinâmico e performático, o FaunaDB. Uma outra opção seria o DynamoDB.
