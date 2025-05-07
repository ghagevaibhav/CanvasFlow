"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/", label: "Home" },
    {
      href: "#features",
      label: "Features",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        document
          .getElementById("features")
          ?.scrollIntoView({ behavior: "smooth" });
      },
    },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/70 backdrop-blur-lg shadow-sm rounded-2xl shadow-transparent"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between rounded-2xl">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-xl font-bold">
            Canvas<span className="text-primary">Flow</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.onClick}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {status === "unauthenticated" ? (
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/signin">
              <Button className="hover: cursor-pointer" variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="hover: cursor-pointer" size="sm">Sign Up</Button>
            </Link>
          </div>
        ) : (
          <div
            className="relative flex items-center space-x-2"
            ref={dropdownRef}
          >
            <ThemeToggle />
            <div
              className="flex ml-2 items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="w-full h-full rounded-full object-cover"
                  priority
                />
              ) : (
                <span className="text-sm font-medium">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 top-12 w-24 bg-background border rounded-md shadow-lg transition-all duration-200 ease-in-out ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm px-3 py-1.5 h-auto"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Btn */}
        <div className="flex items-center md:hidden space-x-2">
          <ThemeToggle />
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-sm border-b shadow-lg animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick(e);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-secondary text-foreground"
                    : "hover:bg-secondary/50"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t flex flex-col space-y-2">
              <Link href="/signin" className="w-full">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
