import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@acme/ui";
import { ThemeProvider, ThemeToggle } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { env } from "~/env";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://coolify-tweaks.techwithanirudh.com"
      : "http://localhost:3000",
  ),
  title: "Coolify Tweaks",
  description: "Opinionated tweaks for Coolify: better spacing, layout, and colors.",
  openGraph: {
    title: "Coolify Tweaks",
    description: "Opinionated tweaks for Coolify: better spacing, layout, and colors.",
    url: "http://coolify-tweaks.techwithanirudh.com",
    siteName: "Coolify Tweaks",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AnirudhWith",
    creator: "@AnirudhWith",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider>
          {props.children}
          <div className="absolute right-4 bottom-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
