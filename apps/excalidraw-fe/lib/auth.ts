import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signup", // Redirect to signup page for sign in
    error: "/signup", // Redirect to signup page on error
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // If the user is already signed up, redirect to sign in page
      if (url === baseUrl) {
        return Promise.resolve("/signin"); // Redirect to sign in page
      }
      return Promise.resolve(url);
    },
  },
};
