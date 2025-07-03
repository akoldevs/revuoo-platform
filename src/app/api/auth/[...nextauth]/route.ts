// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    // We use a Credentials provider as a placeholder.
    // The actual authentication will be handled by our Supabase client.
    CredentialsProvider({
      name: 'Supabase',
      credentials: {},
      async authorize(credentials: Record<string, unknown>) {
        // When we call signIn('credentials', ...), the user object
        // we pass will be available here. We just need to return it.
        if (credentials.user) {
          const user = JSON.parse(credentials.user)
          return user
        }
        return null
      },
    }),
  ],
  callbacks: {
    // The JWT callback is essential for passing Supabase data to the session
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        // Add any other Supabase user properties you want in the session token
      }
      return token
    },
    // The session callback makes the data available to the client
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }