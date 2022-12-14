import { HTMLAttributes, ReactNode, forwardRef } from "react";

import { cx } from "class-variance-authority";

export type PageSectionProps = {
  children?: ReactNode;
  className?: HTMLAttributes<HTMLElement>["className"];
};

export const PageSection = forwardRef<HTMLElement, PageSectionProps>(
  function PageSection(
    { children, className, ...rest }: PageSectionProps,
    ref
  ) {
    return (
      <section
        {...rest}
        className={cx(
          "max-w-4xl px-4 py-10 mx-auto md:px-8 md:py-0",
          className
        )}
        ref={ref}
      >
        {children}
      </section>
    );
  }
);
