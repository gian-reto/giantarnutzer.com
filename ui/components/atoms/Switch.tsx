"use client";

import { HTMLAttributes, forwardRef, useId } from "react";
import { Icon, IconProps } from "#/ui/components/atoms/Icon";

import { cx } from "class-variance-authority";

type SwitchProps = Omit<
  HTMLAttributes<HTMLLabelElement>,
  "htmlFor" | "className"
> & {
  onChange?: (checked: boolean) => void;
  className?: HTMLAttributes<HTMLLabelElement>["className"];
  symbol?: {
    on: IconProps["symbol"];
    off: IconProps["symbol"];
  };
  checked?: boolean;
};

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(function Switch(
  { onChange, className, symbol, checked, ...rest }: SwitchProps,
  ref
) {
  const id = useId();

  return (
    <label
      {...rest}
      ref={ref}
      htmlFor={id}
      className={cx(
        "inline-block w-16 h-10 p-1 rounded-full bg-black/10 dark:bg-white/10 hover:cursor-pointer",
        className
      )}
    >
      <input
        id={id}
        className="hidden peer"
        type="checkbox"
        onChange={(event) => {
          onChange?.(event.target.checked);
        }}
        checked={checked}
      />
      <span
        className={cx(
          "inline-block h-8 w-8 p-1 rounded-full",
          "transition-all duration-300",
          "translate-x-[0rem] rotate-0 peer-checked:translate-x-[1.5rem] peer-checked:rotate-[360deg]",
          symbol ? "" : "bg-white"
        )}
      >
        {symbol && (
          <Icon
            className="w-full h-full"
            symbol={checked ? symbol.on : symbol.off}
          />
        )}
      </span>
    </label>
  );
});
