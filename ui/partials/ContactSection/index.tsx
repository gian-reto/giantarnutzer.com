"use client";

import { Icon, IconProps } from "#/ui/components/atoms/Icon";

import { NonNullable } from "#/lib/types/Lang";
import { cx } from "class-variance-authority";
import styles from "./index.module.css";

export type ContactSectionProps = {
  progress: number;
  isLikelyMobile: boolean;
};

export const ContactSection = ({
  progress,
  isLikelyMobile,
}: ContactSectionProps) => {
  return (
    <>
      <h2
        className="mb-4 text-6xl font-semibold text-left xs:text-7xl sm:text-8xl md:text-9xl sm:mb-8 md:mb-16"
        style={{
          transform: !isLikelyMobile
            ? `translate3d(0px, ${progress * 150}px, 0px)`
            : undefined,
        }}
      >
        Get in
        <br />
        touch
      </h2>
      <p className="mb-8 text-lg sm:text-xl md:mb-14">
        My email is{" "}
        <a
          href="mailto:hi@giantarnutzer.com"
          className={cx(
            "underline underline-offset-8",
            "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100",
            styles.badge
          )}
        >
          hi@giantarnutzer.com
        </a>
      </p>
      <div className="block space-x-4 md:space-x-6">
        {socials.map(({ name, symbol, url }, index) => (
          <a
            key={symbol}
            className={cx("no-underline", "group")}
            title={`Open ${name} profile`}
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            <Icon
              symbol={symbol}
              className="inline-block transition-transform w-9 group-hover:scale-110"
            />
          </a>
        ))}
      </div>
    </>
  );
};

const socials: Array<{
  name: string;
  symbol: NonNullable<IconProps["symbol"]>;
  url: string;
}> = [
  { name: "GitHub", symbol: "github", url: "https://github.com/gian-reto" },
  {
    name: "Unsplash",
    symbol: "unsplash",
    url: "https://unsplash.com/@reto_gian",
  },
  {
    name: "LinkedIn",
    symbol: "linkedin",
    url: "https://linkedin.com/in/gian-reto-tarnutzer",
  },
];
