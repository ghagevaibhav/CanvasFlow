"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Mail, Lock, ArrowRight } from "lucide-react";
import GithubButton from "@/components/github-sign-in";
import GoogleButton from "@/components/google-sign-in";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      setError("Please fill in all fields");
      console.log(error);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
      console.error("Sign-in failed:", result?.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <ThemeToggle />
      </div>

      <Link
        href="/"
        className="absolute top-8 left-8 text-xl font-semibold bg-gradient-to-r from-app-blue to-app-purple bg-clip-text text-transparent"
      >
        Canvas<span className="font-light">Flow</span>
      </Link>

      <Card className="w-full max-w-md glass-panel animate-fade-in-up shadow-lg border-opacity-50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Welcome back to CanvasFlow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80 w-lg">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@example.com"
                  className="pl-10 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-foreground/80">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs text-app-blue hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="pl-10 transition-all"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-black cursor-pointer text-white dark:bg-white dark:text-black hover:bg-app-blue/90 transition-all duration-300 mt-2 font-medium"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or sign in with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <GoogleButton />
            <GithubButton />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-app-blue hover:underline transition-colors font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      {error && (
        <div className="error-message">
          {error === "OAuthAccountNotLinked"
            ? "This email is already linked with another provider"
            : "Authentication failed. Please try again."}
        </div>
      )}
    </div>
  );
};

export default SignIn;
