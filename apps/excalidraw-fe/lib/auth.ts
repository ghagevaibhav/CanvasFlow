import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "JohnDoe" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch("/your/endpoint", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
        if (res.ok && user) {
          return user
        }
        return null
      }
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
  secret: process.env.NEXTAUTH_SECRET
  // pages: {
  //   signIn: "/signup", // Redirect to signup page for sign in
  //   error: "/signup", // Redirect to signup page on error
  // },
  // callbacks: {
  //   async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
  //     // If the user is already signed up, redirect to sign in page
  //     if (url === baseUrl) {
  //       return Promise.resolve("/signin"); // Redirect to sign in page
  //     }
  //     return Promise.resolve(url);
  //   },
  // },
};
