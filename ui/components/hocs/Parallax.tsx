"use client";

import {
  Children,
  ElementType,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { P, match } from "ts-pattern";
import { clamp, roundFraction } from "#/lib/helpers/math";
import { equals, isFunction } from "remeda";
import {
  useDebounce,
  useMeasure,
  usePrevious,
  useWindowScroll,
  useWindowSize,
} from "react-use";

import { PolymorphicComponentProps } from "#/lib/types/PolymorphicComponent";
import { RecursiveRequired } from "#/lib/types/Object";
import { isEqualComponentType } from "#/lib/helpers/component-type";

/*
 * Main component
 */

export type ParallaxBaseProps = {
  children?: ReactNode;
};

type ParallaxProps<C extends ElementType> = PolymorphicComponentProps<
  C,
  ParallaxBaseProps
>;

type ParallaxComponentType = <C extends ElementType = "div">(
  props: ParallaxProps<C>
) => ReactElement | null;

type ParallaxSubcomponents = {
  Section: SectionComponentType;
};

export const Parallax: ParallaxComponentType & ParallaxSubcomponents = <
  C extends ElementType = "div"
>({
  as,
  children,
  ...rest
}: ParallaxProps<C>) => {
  const Component = as || "div";

  const childrenArray = Children.toArray(children);

  const [debouncedViewportHeight, setDebouncedViewportHeight] = useState(0);
  const [debouncedContainerHeight, setDebouncedContainerHeight] = useState(0);

  const { y } = useWindowScroll();
  const { height: viewportHeight } = useWindowSize();
  const [containerRef, { height: containerHeight }] = useMeasure();

  useDebounce(
    () => {
      setDebouncedViewportHeight(viewportHeight);
    },
    500,
    [viewportHeight]
  );

  useDebounce(
    () => {
      setDebouncedContainerHeight(containerHeight);
    },
    500,
    [containerHeight]
  );

  return (
    // @ts-expect-error
    <Component {...rest} ref={containerRef}>
      {childrenArray.map((child, index) =>
        isValidElement(child) ? (
          isEqualComponentType(child, <Section />) ? (
            cloneElement(
              child as ReactElement<PropsWithChildren<SectionBaseProps>>,
              {
                _internal: {
                  forwardedKey: index,
                  windowScrollY: y,
                  viewportHeight: debouncedViewportHeight,
                  containerHeight: debouncedContainerHeight,
                },
              }
            )
          ) : (
            cloneElement(child as ReactElement<any>, {
              style: nonTranslatedStyle,
            })
          )
        ) : (
          <div style={nonTranslatedStyle}>{child}</div>
        )
      )}
    </Component>
  );
};

/*
 * Section component
 */

/**
 * Config for a single section of the parallax component.
 *
 * @param speed The speed of the section. 1 is equal to the default speed, 0..1 is slower, > 1 is faster. Negative values invert the direction.
 * @param origin The origin of the section (where the section's original position should line up with the viewport during animation).
 * @param easing The easing function to use for the section.
 * @param outside The target values for the section when it's scrolled out of the viewport.
 * @param inside The target values for the section when it's fully visible in the viewport.
 */
export type ParallaxConfig = {
  speed?: number;
  origin?: ParallaxOrigin;
  easing?: ParallaxEasing;
  outside?: {
    opacity?: number;
    translateZ?: number;
  };
  inside?: {
    opacity?: number;
    translateZ?: number;
  };
};

type SectionChildProps = {
  progress: number;
};

type SectionBaseProps = {
  children?: ReactNode | ((props: SectionChildProps) => ReactNode);
  config?: ParallaxConfig;
  _internal?: {
    forwardedKey?: number;
    windowScrollY: number;
    viewportHeight: number;
    containerHeight: number;
  };
};

type SectionProps<C extends ElementType> = PolymorphicComponentProps<
  C,
  SectionBaseProps
>;

type SectionComponentType = <C extends ElementType = "div">(
  props: SectionProps<C>
) => ReactElement | null;

const Section: SectionComponentType = <C extends ElementType = "div">({
  as,
  children,
  config: {
    speed = defaultConfig.speed,
    origin = defaultConfig.origin,
    easing = defaultConfig.easing,
    outside: {
      opacity: outsideOpacity = defaultConfig.outside.opacity,
      translateZ: outsideTranslateZ = defaultConfig.outside.translateZ,
    } = {
      opacity: defaultConfig.outside.opacity,
      translateZ: defaultConfig.outside.translateZ,
    },
    inside: {
      opacity: insideOpacity = defaultConfig.inside.opacity,
      translateZ: insideTranslateZ = defaultConfig.inside.translateZ,
    } = {
      opacity: defaultConfig.inside.opacity,
      translateZ: defaultConfig.inside.translateZ,
    },
  } = {},
  _internal: {
    forwardedKey,
    windowScrollY,
    viewportHeight,
    containerHeight,
  } = {
    windowScrollY: 0,
    viewportHeight: 0,
    containerHeight: 0,
  },
  ...rest
}: SectionProps<C>) => {
  const Component = as || "div";

  const ref = useRef<HTMLDivElement>();
  const previousContainerHeight = usePrevious(containerHeight);
  const [
    [progressFromOriginY, translateY, translateZ, opacity],
    setTransition,
  ] = useState([
    0,
    0,
    defaultConfig.outside.translateZ,
    defaultConfig.outside.opacity,
  ]);

  const multiplier = useMemo(() => getSpeedDirectionMultiplier(speed), [speed]);

  useEffect(() => {
    if (!ref.current) return;

    const [newProgressFromOriginY, newTranslateY, newTranslateZ, newOpacity] =
      calculateTranslation(
        origin,
        easing,
        multiplier,
        ref.current,
        viewportHeight,
        windowScrollY,
        outsideOpacity,
        outsideTranslateZ,
        insideOpacity,
        insideTranslateZ,
        equals(containerHeight, previousContainerHeight) // If `false`, `handleScroll` will run without additional optimizations
      );

    if (
      equals(newTranslateY, undefined) &&
      equals(newTranslateZ, undefined) &&
      equals(newOpacity, undefined)
    )
      return;

    if (
      equals(newTranslateY, translateY) &&
      equals(newTranslateZ, translateZ) &&
      equals(newOpacity, opacity)
    )
      return;

    setTransition([
      equals(newProgressFromOriginY, undefined)
        ? progressFromOriginY
        : newProgressFromOriginY!,
      equals(newTranslateY, undefined) ? translateY : newTranslateY!,
      equals(newTranslateZ, undefined) ? translateZ : newTranslateZ!,
      equals(newOpacity, undefined) ? opacity : newOpacity!,
    ]);
  }, [
    windowScrollY,
    viewportHeight,
    containerHeight,
    speed,
    origin,
    multiplier,
  ]);

  return (
    <Component
      {...rest}
      key={forwardedKey}
      // `isolate` is used to prevent issues with uncontrolled overlap due to `perspective` and `translate3d`, mainly in Safari
      style={{ isolation: "isolate" }}
    >
      <div
        // @ts-expect-error
        ref={ref}
        style={{
          transform: `perspective(20rem) translate3d(0px, ${translateY}px, ${translateZ}px)`,
          opacity,
        }}
      >
        {isFunction(children)
          ? children({ progress: progressFromOriginY })
          : children}
      </div>
    </Component>
  );
};

Parallax.Section = Section;

/*
 * Types
 */

export enum ParallaxOrigin {
  TOP,
  BOTTOM,
  CENTER,
}

/*
 * Calculations
 */

const calculateTranslation = (
  origin: ParallaxOrigin,
  easing: ParallaxEasing,
  multiplier: number,
  element: HTMLElement,
  parentViewportHeight: number,
  parentScrollDistanceY: number,
  outsideOpacity: number,
  outsideTranslateZ: number,
  insideOpacity: number,
  insideTranslateZ: number,
  lazy: boolean
) => {
  const bounds = getVerticalBounds(element, parentScrollDistanceY);
  const progressFromOriginY = calculateProgressY(
    origin,
    bounds,
    parentViewportHeight
  );
  const progressToOriginY = 1 - clamp(Math.abs(progressFromOriginY), 0, 1);

  const maxTranslateY = bounds.height * multiplier;
  const translateY = equals(multiplier, 1)
    ? undefined
    : calculateTranslateY(maxTranslateY, 0, progressFromOriginY);

  // Exit if `translateY` would not be in viewport to avoid rerendering, except if `currentTranslateY` is still the initial value
  if (lazy && !isInViewport(bounds, parentViewportHeight, translateY))
    return [undefined, undefined, undefined];

  const translateZ = calculateTranslateZ(
    outsideTranslateZ,
    insideTranslateZ,
    progressToOriginY,
    easing
  );

  const opacity = calculateOpacity(
    outsideOpacity,
    insideOpacity,
    progressToOriginY,
    easing
  );

  return [
    withEasing(progressFromOriginY, easing),
    translateY,
    translateZ,
    opacity,
  ];
};

const calculateProgressY = (
  origin: ParallaxOrigin,
  bounds: VerticalBounds,
  parentViewportHeight: number
) => _progressFunctions[origin](bounds, parentViewportHeight);

const calculateTranslateY = (
  outsideTranslateY: number,
  insideTranslateY: number,
  progressToOrigin: number
) =>
  roundFraction(progressToOrigin * (outsideTranslateY - insideTranslateY), 3);

const calculateOpacity = (
  outsideOpacity: number,
  insideOpacity: number,
  progressToCenter: number,
  easing: ParallaxEasing
) =>
  outsideOpacity != defaultConfig.outside.opacity
    ? roundFraction(
        lerp(outsideOpacity, insideOpacity, progressToCenter, easing),
        2
      )
    : undefined;

const calculateTranslateZ = (
  outsideTranslateZ: number,
  insideTranslateZ: number,
  progressToCenter: number,
  easing: ParallaxEasing
) =>
  outsideTranslateZ != defaultConfig.outside.translateZ
    ? roundFraction(
        lerp(outsideTranslateZ, insideTranslateZ, progressToCenter, easing),
        3
      )
    : undefined;

/*
 * Constants
 */

const nonTranslatedStyle = {
  transform: "translate3d(0px, 0px, 0px)",
};

const defaultConfig: RecursiveRequired<ParallaxConfig> = {
  speed: 1, // Don't animate `speed` per default (= no parallax)
  origin: ParallaxOrigin.CENTER,
  easing: "linear",
  outside: {
    opacity: 1, // Don't animate `opacity` per default
    translateZ: 0, // Don't animate `translateZ` per default
  },
  inside: {
    opacity: 1, // Don't animate `opacity` per default
    translateZ: 0, // Don't animate `translateZ` per default
  },
};

/*
 * Progress functions
 */

const _progressFunctions = {
  [ParallaxOrigin.TOP]: (
    bounds: VerticalBounds,
    parentViewportHeight: number
  ) => bounds.top / parentViewportHeight,
  [ParallaxOrigin.CENTER]: (
    bounds: VerticalBounds,
    parentViewportHeight: number
  ) =>
    (2 * bounds.bottom - parentViewportHeight - bounds.height) /
    parentViewportHeight,
  [ParallaxOrigin.BOTTOM]: (
    bounds: VerticalBounds,
    parentViewportHeight: number
  ) => (bounds.bottom - parentViewportHeight) / parentViewportHeight,
};

/*
 * Easing functions
 */

export type ParallaxEasing = keyof typeof _easingFunctions;

const _easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

const withEasing = (value: number, easing: ParallaxEasing) =>
  clamp(_easingFunctions[easing](value), -1, 1);

/*
 * Helpers
 */

const lerp = (
  start: number,
  end: number,
  progress: number,
  easing: ParallaxEasing
) => start + (end - start) * withEasing(progress, easing);

const getSpeedDirectionMultiplier = (speed: number) => {
  const multiplier = match({ speed })
    .with({ speed: P.when((s) => Math.abs(s) >= 1) }, () => speed)
    .with({ speed: P.when((s) => s < 0) }, ({ speed }) => -speed)
    .with({ speed: P.when((s) => s > 0) }, ({ speed }) => -(1 - speed))
    .otherwise(() => 0);

  return multiplier;
};

/**
 * Bounds of an element relative to the visible area of the parent element (viewport).
 *
 * @param height Height of the element.
 * @param top Distance of the top of the element from the top of the viewport.
 * @param bottom Distance of the bottom of the element from the top of the viewport.
 */
type VerticalBounds = {
  readonly height: number;
  readonly top: number;
  readonly bottom: number;
};

/**
 * Calculates the bounds of an element relative to the visible area of the parent element.
 *
 * @remarks
 *
 * Uses the parent's scroll distance to calculate the bounds to ignore possible transforms applied to the element.
 *
 * @param element The element to measure.
 * @param parentScrollDistanceY Current scroll distance of the parent element.
 *
 * @returns Bounds of the element relative to the visible area of the parent element, or `undefined` if the element is not in the visible area.
 */
const getVerticalBounds = (
  element: HTMLElement,
  parentScrollDistanceY: number
): VerticalBounds => {
  const rect = element.getBoundingClientRect();
  const height = rect.height;
  const top = element.offsetTop - parentScrollDistanceY;
  const bottom = top + height;

  return {
    height,
    top,
    bottom,
  };
};

const isInViewport = (
  bounds: VerticalBounds,
  parentViewportHeight: number,
  translateY: number = 0
) => {
  return (
    bounds.top + translateY <= parentViewportHeight &&
    bounds.top + parentViewportHeight + translateY >= 0
  );
};
