import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DocsNavbar } from "@/components/docs-navbar";
import { ConfirmProvider } from "@/components/ui/confirm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistHeading = Geist({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MICTO UI KIT",
  description:
    "A collection of UI components and utilities for building modern web applications with shadcn/ui.",
};

import { ThemeProvider } from "@/components/theme-provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        geistSans.variable,
        geistMono.variable,
        geistHeading.variable,
        inter.variable,
      )}
    >
      <body className="min-h-screen bg-background text-foreground tracking-tight">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ConfirmProvider />
            <div className="relative flex min-h-screen flex-col">
              <DocsNavbar />
              <div className="flex-1">{children}</div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
