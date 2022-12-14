"use client";

import { Parallax, ParallaxOrigin } from "#/ui/components/hocs/Parallax";
import { Suspense, lazy } from "react";

import { AboutSection } from "#/ui/partials/AboutSection";
import { ContactSection } from "#/ui/partials/ContactSection";
import { IntroSection } from "#/ui/partials/IntroSection";
import { Loader } from "#/ui/components/atoms/Loader";
import { PageSection } from "#/ui/components/hocs/PageSection";
import { Theme } from "#/lib/constants/Theme";
import { cx } from "class-variance-authority";
import { equals } from "remeda";
import { useTheme } from "@wits/next-themes";

const LazyThreeText = lazy(() =>
  import("#/ui/components/organisms/ThreeText").then((module) => ({
    default: module.ThreeText,
  }))
);

const heroClassNames = "w-[100vw] h-[75vh] md:h-[85vh]";

export default function Page() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Parallax>
        <Parallax.Section
          as="section"
          config={{
            speed: 0.6,
            origin: ParallaxOrigin.TOP,
          }}
          className={cx("relative block", heroClassNames)}
        >
          <Suspense
            fallback={
              <Loader
                className={cx(
                  "text-neutral-900 dark:text-neutral-100",
                  heroClassNames
                )}
              />
            }
          >
            <LazyThreeText
              className={cx(
                "flex place-content-center overflow-hidden",
                heroClassNames
              )}
              lineColor={
                equals(Theme.DARK, resolvedTheme)
                  ? "rgb(125, 125, 125)"
                  : "rgb(244, 238, 217)"
              }
            >
              Hi,
            </LazyThreeText>
          </Suspense>
        </Parallax.Section>

        <Parallax.Section
          as={PageSection}
          config={{
            speed: 1,
            origin: ParallaxOrigin.BOTTOM,
            easing: "easeOutQuint",
            outside: {
              opacity: 0,
              translateZ: -50,
            },
          }}
        >
          <IntroSection />
        </Parallax.Section>

        <Parallax.Section
          as={PageSection}
          config={{
            speed: 1.25,
            origin: ParallaxOrigin.CENTER,
            easing: "easeOutQuad",
            outside: {
              opacity: 0,
              translateZ: -50,
            },
          }}
        >
          {({ progress, isLikelyMobile }) => (
            <AboutSection progress={progress} isLikelyMobile={isLikelyMobile} />
          )}
        </Parallax.Section>

        <Parallax.Section
          as={PageSection}
          className="mb-20"
          config={{
            speed: 1.25,
            origin: ParallaxOrigin.BOTTOM,
            easing: "easeOutQuad",
            outside: {
              opacity: 0,
              translateZ: -50,
            },
          }}
        >
          {({ progress, isLikelyMobile }) => (
            <ContactSection
              progress={progress}
              isLikelyMobile={isLikelyMobile}
            />
          )}
        </Parallax.Section>
      </Parallax>
    </>
  );
}
