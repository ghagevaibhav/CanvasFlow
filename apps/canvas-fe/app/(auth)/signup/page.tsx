"use client";
import axios from "axios";
import React, { useState } from "react";
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
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import GoogleButton from "@/components/google-sign-in";
import GithubButton from "@/components/github-sign-in";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // const validatePassword = (password: string) => {
  //   const minLength = 8;
  //   const hasNumber = /\d/.test(password);
  //   const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  //   return password.length >= minLength && hasNumber && hasSymbol;
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // if (!validatePassword(password)) {
    //   setError('Password must be at least 8 characters with a number and symbol');
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
          toast.success("Account created successfully!");
        } else {
          throw new Error("Account created but login failed");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Signup failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
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
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join CanvasFlow to unleash your creativity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={isLoading}
              type="submit"
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 transition-all duration-300 mt-2 font-medium hover:cursor-pointer"
            >
              {isLoading ? "Creating...." : "Create Account"}
              {isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
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
            <GoogleButton />
            <GithubButton />
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
