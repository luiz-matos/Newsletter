import NextAuth, { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { prisma } from '../../../services/prisma'

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: 'read:user user:email' } },
    }),
  ],
  theme: {
    colorScheme: 'dark',
  },
  callbacks: {
    async signIn({ user }) {
      // O e-mail é a chave que liga o usuário ao cliente do Stripe
      if (!user.email) return false

      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name },
        create: { email: user.email, name: user.name },
      })
      return true
    },
    async session({ session }) {
      const subscription = await prisma.subscription.findFirst({
        where: { status: 'active', user: { email: session.user.email } },
      })
      return { ...session, activeSubscription: Boolean(subscription) }
    },
  },
}

export default NextAuth(authOptions)
