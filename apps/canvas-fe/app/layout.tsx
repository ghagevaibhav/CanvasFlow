import { Metadata } from "next";
import { Toaster } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import "@/app/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CanvasFlow",
  description: "Interactive canvas drawing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeProvider defaultTheme="light" storageKey="canvasflow-theme">
            {children}
            <Toaster />
            <Sonner />
            <CustomCursor />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
