import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { BACKEND_URL } from "@/config/config";
import prisma from "@repo/db/index"
import { PrismaAdapter } from '@auth/prisma-adapter'


import * as bcrypt from 'bcrypt'

// fn to generate a random password
async function generateHashedRandomPassword(): Promise<string> {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

interface UserData {
  id: string;
  name: string;
  password?: string;
  email: string;
  image: string | null;
  emailVerified: Date | null;
}
export const authOptions = {
  adapter: {
    ...PrismaAdapter(prisma), 
    createUser: async (data: UserData) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });
   
        if (existingUser) {
          throw new Error('Email already in use');
          return;
        }

        if (!data.password) {
          data.password = await generateHashedRandomPassword();
        }
        return await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: data.password,
            image: data.image,
            emailVerified: data.emailVerified,
          }
        });
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    }
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "JohnDoe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${BACKEND_URL}/user/signup`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin", // Redirect to signup page for sign in
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // if the user is already signed up, redirect to sign in page
      if (url === baseUrl) {
        return Promise.resolve("/signin"); // Redirect to sign in page
      }
      return Promise.resolve(url);
    },
    // async session(session, user) {
    //   session.user.id = user.id;
    //   return session;
    // },
  },
};
