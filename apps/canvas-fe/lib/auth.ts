import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { BACKEND_URL } from "@/config/config";
import prisma from "@repo/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter";

// import * as bcrypt from "bcrypt";

interface Credentials {
  username: string; // or whatever fields you expect
  password: string;
}

interface SignInParams {
  user: {
      id: string;
      name: string;
      email: string;
  } | null;
  account: {
      provider: string;
      type: string;
  };
  profile: {
      id: string;
      name: string;
      email: string;
  };
  email?: string;
  credentials?: Credentials;
}

// fn to generate a random password
// async function generateHashedRandomPassword(): Promise<string> {
//   const charset =
//     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//   let password = "";
//   for (let i = 0; i < 16; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     password += charset[randomIndex];
//   }

//   const saltRounds = 10;
//   const hash = await bcrypt.hash(password, saltRounds);
//   return hash;
// }

// interface UserData {
//   id: string;
//   name: string;
//   password?: string | null;
//   email: string;
//   image: string | null;
//   emailVerified: Date | null;
// }
export const authOptions = {
  adapter: {
    ...PrismaAdapter(prisma)
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "JohnDoe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if credentials are provided
        if (!credentials) {
            console.error("No credentials provided");
            return null; // Return null if credentials are not provided
        }

        console.log("Credentials:", credentials);
        const res = await fetch(`${BACKEND_URL}/user/signin`, {
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
    async signIn({ user, account, profile, email, credentials }: SignInParams) {
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      console.log("Email:", email);
      console.log("Credentials:", credentials);
      
      // You can add your custom logic here, e.g., validating the user
      return true; // Return true if sign-in is successful
    },
  },
};
