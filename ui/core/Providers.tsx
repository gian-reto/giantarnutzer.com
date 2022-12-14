"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@wits/next-themes";
import { defaultThemeProviderProps } from "#/lib/constants/Theme";

export type ProvidersProps = {
  children?: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <ThemeProvider {...defaultThemeProviderProps}>{children}</ThemeProvider>
    </>
  );
};
