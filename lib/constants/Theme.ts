import { ThemeProviderProps } from "@wits/next-themes/dist/types";
import { ValueOf } from "#/lib/types/Collection";

export const Theme = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type Theme = ValueOf<typeof Theme>;

export const defaultThemeProviderProps: ThemeProviderProps = {
  attribute: "class",
  themes: [...Object.values(Theme)],
  // defaultTheme: Theme.LIGHT,
  enableSystem: true,
};
