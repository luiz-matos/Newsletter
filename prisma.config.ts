import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Mesmos arquivos que o Next lê, na mesma ordem de prioridade
config({ path: ['.env.local', '.env'], quiet: true })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Opcional aqui para o `prisma generate` do postinstall rodar sem banco configurado
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
