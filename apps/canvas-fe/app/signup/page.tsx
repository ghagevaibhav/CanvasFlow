"use client";

import React from "react";
import { signIn } from "next-auth/react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, Mail, Lock, ArrowRight, Github } from "lucide-react";

const SignUp = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would handle registration here
    // For now, we'll just redirect to sign-in
    signIn(undefined, { callbackUrl: "/" });
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
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join CanvasFlow to unleash your creativity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80 w-lg">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="pl-10 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">
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
              <Label htmlFor="password" className="text-foreground/80">
                Password
              </Label>
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
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with a number and a symbol
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                className="data-[state=checked]:bg-app-blue"
                required
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-app-blue hover:underline transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-app-blue hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 transition-all duration-300 mt-2 font-medium"
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full transition-all hover:bg-muted/40"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full transition-all hover:bg-muted/40"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-app-blue hover:underline transition-colors font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
