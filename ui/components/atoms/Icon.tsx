import { SVGAttributes, forwardRef } from "react";

export type IconProps = Omit<SVGAttributes<SVGElement>, "className"> & {
  className?: SVGAttributes<SVGElement>["className"];
  symbol?: "sun" | "moon" | "github" | "unsplash" | "linkedin";
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { className: customClassName, symbol, ...rest },
  ref
) {
  const className = customClassName ? customClassName : "w-5 h-5";

  switch (symbol) {
    case "sun":
      return (
        <svg
          {...rest}
          ref={ref}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 99 99"
        >
          <path
            fill="currentColor"
            fillRule="nonzero"
            d="M52.5 84v15h-6V84h6ZM23.22 72l4.28 4.28L16.78 87l-4.28-4.28L23.22 72Zm52.56 0L86.5 82.72 82.22 87 71.5 76.28 75.78 72ZM49.5 25a25 25 0 1 1 0 50 25 25 0 0 1 0-50Zm49 22v6h-15v-6h15Zm-83 0v6H.5v-6h15Zm66.72-35 4.28 4.28L75.78 27l-4.28-4.28L82.22 12Zm-65.44 0L27.5 22.72 23.22 27 12.5 16.28 16.78 12ZM52.5 0v15h-6V0h6Z"
          />
        </svg>
      );

    case "moon":
      return (
        <svg
          {...rest}
          ref={ref}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 99 99"
        >
          <path
            fill="currentColor"
            fillRule="nonzero"
            d="M71.3739624,64.5902944 C70.9284604,64.6056555 70.4829742,64.6210166 70.0374801,64.6210166 C62.6790404,64.6210166 55.750836,61.7175967 50.5581238,56.4174437 C45.3503887,51.132864 42.4929813,44.1120843 42.4929813,36.6313382 C42.4929813,32.3760199 43.4300605,28.2586601 45.1813621,24.5414898 C45.6575862,23.527566 46.6100265,21.9913821 47.2705596,20.9467833 C47.5624354,20.5012813 47.1937544,19.917522 46.6714393,20.009704 C45.7496974,20.1479614 44.3363705,20.455206 42.4161209,21.0543028 C30.4647029,24.8487109 22,36.0936621 22,49.3515168 C22,65.7272011 35.0730187,79 51.2033037,79 C60.1131861,79 68.1012481,74.9444619 73.4630656,68.5382816 C74.3848074,67.4322543 75.2297046,66.4183305 75.9824198,65.1893676 C76.2589345,64.7285046 75.8748845,64.1601063 75.3525773,64.2522884 C74.0467698,64.513442 72.7257036,64.528803 71.3738051,64.5902551 L71.3739624,64.5902944 Z"
          />
        </svg>
      );

    case "github":
      return (
        <svg
          {...rest}
          ref={ref}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 35 35"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M17.5 1C8.38 1 1 8.46 1 17.66c0 7.37 4.72 13.6 11.28 15.8.83.15 1.14-.35 1.14-.78l-.02-3.1c-4.15.76-5.22-1.03-5.55-1.96-.19-.48-1-1.96-1.7-2.36-.57-.31-1.4-1.08-.01-1.1 1.3-.02 2.22 1.2 2.53 1.7 1.49 2.53 3.86 1.82 4.8 1.38a3.52 3.52 0 0 1 1.06-2.23c-3.67-.41-7.5-1.85-7.5-8.22 0-1.82.63-3.32 1.68-4.48a6.04 6.04 0 0 1 .17-4.42s1.38-.43 4.54 1.71a15.17 15.17 0 0 1 8.25 0c3.15-2.16 4.53-1.7 4.53-1.7.91 2.28.33 4 .17 4.4a6.48 6.48 0 0 1 1.69 4.49c0 6.39-3.86 7.8-7.53 8.22.6.52 1.12 1.52 1.12 3.08l-.02 4.59c0 .43.3.95 1.13.79A16.67 16.67 0 0 0 34 17.67C34 8.45 26.62 1 17.5 1Z"
          />
        </svg>
      );

    case "unsplash":
      return (
        <svg
          {...rest}
          ref={ref}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 35 35"
        >
          <path
            fill="currentColor"
            fillRule="nonzero"
            d="M22.84 16.1H32V32H3V16.1h9.12v7.93h10.72V16.1ZM22.64 3H12.36v8.42h10.3V3Z"
          />
        </svg>
      );

    case "linkedin":
      return (
        <svg
          {...rest}
          ref={ref}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 35 35"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M9.06 32V11.76H2.39V32h6.67ZM5.72 9C8.05 9 9.5 7.43 9.5 5.5 9.45 3.5 8.05 2 5.77 2 3.49 2 2 3.51 2 5.5c0 1.86 1.33 3.36 3.4 3.49h.32Zm6.94 23h6.67V20.68c0-.6.04-1.21.22-1.64.48-1.21 1.57-2.46 3.41-2.46 2.41 0 3.38 1.85 3.38 4.57V32H33V20.4c0-6.22-3.29-9.12-7.67-9.12a6.63 6.63 0 0 0-6.05 3.42h.05v-2.94h-6.67l.02.43.02 3.43-.04 16.38Z"
          />
        </svg>
      );

    default:
      return (
        <svg
          {...rest}
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
        ></svg>
      );
  }
});
