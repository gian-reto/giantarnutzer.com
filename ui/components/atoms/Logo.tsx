import { SVGAttributes, forwardRef } from "react";

export type LogoProps = Omit<SVGAttributes<SVGElement>, "className"> & {
  className?: SVGAttributes<SVGElement>["className"];
};

export const Logo = forwardRef<SVGSVGElement, LogoProps>(function Logo(
  { className: customClassName, ...rest },
  ref
) {
  const className = customClassName ? customClassName : "w-40 h-9";

  return (
    <svg
      {...rest}
      ref={ref}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 171 31"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M14.84 33.6c3.4 0 6.08-1.16 8.04-4.44h.08l.2 3.84h4.36V17.8H15.48v4.48h6.88v.16c0 3.16-2.92 6.48-7.36 6.48-4.92 0-8-4.28-8-10.12 0-5.68 2.68-10.16 8.08-10.16 3.68 0 5.8 2 6.44 4.76h5.68c-.92-5.6-5.04-9.56-12.24-9.56-3.84 0-6.88 1.16-9.2 3.28-3 2.76-4.68 6.92-4.68 11.68 0 4.32 1.36 8 3.72 10.64 2.36 2.6 5.72 4.16 10.04 4.16zm90.9315-9.7016v-3.125H32.2949v3.125h73.4766zM116.7064 33V21.52h4.68c3.6 0 5.36 1.76 5.6 4.88.24 3.08.32 6.28 1.04 6.6h5.56v-.28c-1-.44-.84-3.52-1.24-7.56-.36-3.48-1.72-5-4.36-5.76v-.12c3.68-1 5.24-3.56 5.24-6.92 0-4.76-3.68-7.96-9.2-7.96h-13.12V33h5.8zm6.16-15.96h-6.16V9.08h6.32c3.08 0 4.56 1.72 4.56 4.04 0 2.28-1.56 3.92-4.72 3.92zM143.7597 33v-5.8h-5.84V33h5.84zm14.0933 0V9.28h8.6V4.4h-23v4.88h8.6V33h5.8zm14.1334 0v-5.8h-5.84V33h5.84z"
      />
    </svg>
  );
});
