// Lê uma variável obrigatória e falha com uma mensagem clara quando ela falta
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida. Veja o .env.example.`)
  }
  return value
}
