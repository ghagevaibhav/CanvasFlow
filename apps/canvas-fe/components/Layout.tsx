"use client";
import React from 'react';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex min-h-screen-dynamic flex-col">
      <Header />
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CanvasFlow. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a 
              href="#" 
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="transition-colors hover:text-foreground"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="transition-colors hover:text-foreground"
            >
              About
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
