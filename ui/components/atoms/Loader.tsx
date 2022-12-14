import { HTMLAttributes, forwardRef } from "react";

import { cx } from "class-variance-authority";

export type LoaderProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(function Loader(
  { className, ...rest },
  ref
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cx(className, "flex justify-center items-center")}
    >
      <svg
        className={cx("animate-spin relative block w-14 h-14")}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 28 28"
      >
        <g stroke="currentColor" strokeWidth={2} fill="none" fillRule="evenodd">
          <path
            className="opacity-25"
            d="M14 4a9.97 9.97 0 0 1 10 10 9.97 9.97 0 0 1-10 10A9.97 9.97 0 0 1 4 14 9.97 9.97 0 0 1 14 4Z"
          />
          <path d="M14 4c5.5 0 10 4.5 10 10" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
});
