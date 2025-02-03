import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user.models"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
  interface JWT {
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        await connectToDatabase();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordMatch) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: '/login'
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 