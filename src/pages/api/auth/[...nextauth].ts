import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.NEXTAUTH_SECRET,
      authorization: { params: { scope: 'read:user' } },
    }),
  ],
  theme: {
    colorScheme: 'dark'
  }
})
