"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Wand2 } from "lucide-react";

const Hero = () => {
  const handleScrollToDemo = () => {
    const demoSection = document.getElementById("demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-muted/40 animate-fade-in">
            <Wand2 className="mr-1 h-3 w-3" />
            Visual collaboration made simple
          </div>

          {/* Main Heading - Simplified */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-2xl animate-slide-down">
            Create, Collaborate, Share with
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {" "}
              Canvas<span className="text-primary">Flow</span>
            </span>
          </h1>

          {/* Subheading - Simplified */}
          <p
            className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-down"
            style={{ animationDelay: "100ms" }}
          >
            A simple yet powerful drawing tool for diagrams, wireframes, and
            creative collaboration.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-slide-down"
            style={{ animationDelay: "200ms" }}
          >
            <Button size="lg" onClick={handleScrollToDemo}>
              Try Demo
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-8 md:gap-12 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold">Easy</span>
              <span className="text-muted-foreground">to use</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">Real-time</span>
              <span className="text-muted-foreground">collaboration</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">Free</span>
              <span className="text-muted-foreground">to start</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
