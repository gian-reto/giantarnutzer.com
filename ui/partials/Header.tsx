"use client";

import { useEffect, useState } from "react";
import { usePrevious, useWindowScroll } from "react-use";

import { Logo } from "#/ui/components/atoms/Logo";
import { Switch } from "#/ui/components/atoms/Switch";
import { Theme } from "#/lib/constants/Theme";
import { equals } from "remeda";
import { useTheme } from "@wits/next-themes";

type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const { y: currentScrollY } = useWindowScroll();
  const previousScrollY = usePrevious(currentScrollY);

  // Render the theme switch only on the client to prevent theme mismatch errors
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previous = previousScrollY || 0;

    if (currentScrollY < previous) {
      setHidden(false);
    } else if (currentScrollY > 100 && currentScrollY > previous) {
      setHidden(true);
    }
  }, [currentScrollY]);

  return (
    <header
      className={"fixed z-10 w-full transition-transform duration-500"}
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <div className="flex items-center justify-between max-w-4xl gap-4 p-4 mx-auto md:p-8">
        <Logo />
        {mounted ? (
          <Switch
            onChange={(checked) => setTheme(checked ? Theme.DARK : Theme.LIGHT)}
            className="flex-none"
            symbol={{
              on: "moon",
              off: "sun",
            }}
            checked={equals(Theme.DARK, resolvedTheme)}
          />
        ) : null}
      </div>
    </header>
  );
};
