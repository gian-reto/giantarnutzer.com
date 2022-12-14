import "./globals.css";

import { Footer } from "#/ui/partials/Footer";
import { Header } from "#/ui/partials/Header";
import { Inter } from "@next/font/google";
import { Providers } from "#/ui/core/Providers";
import { ReactNode } from "react";
import { ServerThemeProvider } from "@wits/next-themes";
import { defaultThemeProviderProps } from "#/lib/constants/Theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ServerThemeProvider {...defaultThemeProviderProps}>
      <html lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
        <head />
        <body className={inter.variable}>
          <Providers>
            <Header />

            <main>{children}</main>

            <Footer />
          </Providers>
        </body>
      </html>
    </ServerThemeProvider>
  );
}
