---
title: React Compiler e o fim do useMemo em todo lugar
date: 2026-07-30
---

O React Compiler analisa os componentes no build e aplica memorização automática onde ela faz diferença.

Na prática, boa parte dos `useMemo`, `useCallback` e `React.memo` escritos à mão deixa de ser necessária. O compilador descobre sozinho quais valores dependem de quais propriedades.

Ele só consegue fazer isso com código que segue as regras do React: componentes puros, sem mutar propriedades e sem ler valores mutáveis durante a renderização.

Por isso a adoção costuma começar pelo plugin de lint, que aponta os trechos que quebram essas regras antes de ligar o compilador.

A memorização manual não some de vez. Ela continua útil como controle fino, por exemplo para manter a mesma referência de um valor usado como dependência de um efeito.
