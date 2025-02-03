import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user.models"
import bcrypt from "bcryptjs"

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
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
} 