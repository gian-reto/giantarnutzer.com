"use client";

import Image from "next/image";
import { cx } from "class-variance-authority";
import portrait from "#/public/images/portrait.jpg";

export type AboutSectionProps = {
  progress: number;
  isLikelyMobile: boolean;
};

export const AboutSection = ({
  progress,
  isLikelyMobile,
}: AboutSectionProps) => {
  return (
    <div className="grid grid-cols-5 gap-12">
      <div
        className={cx(
          "col-span-5 row-span-4 col-start-1 row-start-1",
          "sm:col-span-4 sm:col-start-1",
          "relative",
          "after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-amber-50",
          "after:dark:to-neutral-900"
        )}
      >
        <Image
          alt="Gian-Reto Tarnutzer portrait"
          src={portrait}
          placeholder="blur"
        />
      </div>
      <div
        className={cx(
          "col-span-3 col-start-3 row-span-3 row-start-3",
          "relative flex place-content-end"
        )}
      >
        <h2
          className={cx(
            "inline-block place-self-end",
            "font-medium text-left text-6xl xs:text-7xl sm:text-8xl md:text-9xl"
          )}
          style={{
            transform: !isLikelyMobile
              ? `translate3d(0px, ${progress * 150}px, 0px)`
              : undefined,
          }}
        >
          Excited
          <br />
          about
        </h2>
      </div>
      <ul
        className={cx(
          "col-span-4 col-start-1 row-span-1 row-start-6",
          "md:col-span-2 md:row-span-2 md:row-start-5",
          "space-y-4 columns-2",
          "text-lg text-left",
          "sm:text-xl"
        )}
      >
        {[
          "TypeScript",
          "JavaScript",
          "React",
          "Next.js",
          "Swift",
          "Kotlin",
        ].map((item, index) => (
          <li
            key={item}
            style={{
              transform: !isLikelyMobile
                ? `translate3d(0px, ${Math.max(
                    progress * 25 * (index + 1),
                    0
                  )}px, 0px)`
                : undefined,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
      <div
        className={cx(
          "flex text-xl sm:text-right sm:w-auto sm:place-content-end",
          "col-span-5 row-span-1 col-start-1 row-start-7",
          "sm:col-span-2 sm:row-span-2 sm:col-start-4 sm:row-start-5"
        )}
      >
        <a
          href="mailto:hi@giantarnutzer.com"
          className={cx(
            "underline underline-offset-8 place-self-end text-lg sm:text-xl",
            "transition-colors text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          )}
        >
          Let's connect
        </a>
      </div>
    </div>
  );
};
