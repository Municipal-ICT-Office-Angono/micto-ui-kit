import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DocsNavbar } from "@/components/docs-navbar";
import { ConfirmProvider } from "@/components/micto/confirm-dialog";

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
  metadataBase: new URL("https://micto-ui-kit.misangono.net"),
  title: {
    default: "MICTO UI KIT | Municipal ICT Office of Angono",
    template: "%s | MICTO UI Kit",
  },
  description:
    "A professional, technology-driven React component library and design system specifically engineered for accessible, scalable municipal government applications. Built for Next.js and Laravel Inertia.js.",
  keywords: [
    "MICTO",
    "Angono",
    "Municipal ICT Office",
    "React",
    "Next.js",
    "Laravel",
    "Inertia.js",
    "TanStack Table",
    "shadcn/ui",
    "Design System",
    "Government Applications",
  ],
  authors: [{ name: "Municipal ICT Office of Angono", url: "https://misangono.net" }],
  creator: "Municipal ICT Office of Angono",
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://micto-ui-kit.misangono.net",
    title: "MICTO UI Kit â€” Build Digital Giants in the Art Capital",
    description:
      "A professional, technology-driven React component library and design system specifically engineered for accessible, scalable municipal government applications.",
    siteName: "MICTO UI Kit",
  },
  twitter: {
    card: "summary_large_image",
    title: "MICTO UI Kit â€” Build Digital Giants in the Art Capital",
    description:
      "A professional, technology-driven React component library and design system specifically engineered for accessible, scalable municipal government applications.",
    creator: "@MICTOAngono",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

