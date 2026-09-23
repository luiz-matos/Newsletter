---
title: Server Components, o que roda onde
date: 2026-08-22
---

Server Components são componentes React que rodam só no servidor. O código deles não vai para o navegador.

Isso muda a pergunta que a gente faz ao montar uma tela. Não é mais "onde busco os dados", e sim "este pedaço precisa de interatividade?".

Se não precisa, ele pode ser um Server Component: acessa o banco direto, lê arquivos e usa bibliotecas pesadas sem aumentar o JavaScript enviado ao usuário.

Se precisa de estado, efeito ou evento de clique, ele vira um Client Component, marcado com `"use client"` no topo do arquivo.

A regra que mais evita confusão: um Client Component não importa um Server Component, mas pode recebê-lo como `children`. Assim a parte interativa fica pequena e o resto continua no servidor.

O custo é conhecer bem a fronteira. Tudo que passa do servidor para o cliente precisa ser serializável, então função e instância de classe não atravessam.
