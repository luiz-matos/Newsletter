---
title: Actions no React 19, formulários sem estado de carregamento manual
date: 2026-09-10
---

O React 19 trouxe as Actions, uma forma de ligar uma função assíncrona direto a um formulário.

Antes, todo formulário precisava de três estados: o valor, o carregamento e o erro. Com a Action, o React cuida do carregamento e do erro, e o componente fica só com o que importa.

O hook `useActionState` recebe a função e o estado inicial, e devolve o estado atual, a função para o `action` do formulário e um indicador de pendência.

```tsx
const [error, submit, isPending] = useActionState(updateName, null)

return (
  <form action={submit}>
    <input name="name" />
    <button disabled={isPending}>Salvar</button>
    {error && <p>{error}</p>}
  </form>
)
```

Para botões que ficam fora do componente do formulário, o `useFormStatus` lê a pendência do formulário pai, sem precisar passar propriedade.

O ganho não é só menos código. A atualização otimista com `useOptimistic` passa a ter um lugar natural: o valor novo aparece na hora e volta sozinho se a Action falhar.
