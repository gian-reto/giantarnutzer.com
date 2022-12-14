/**
 * An alternative to TypeScript's `Partial` type, with support for nested objects.
 *
 * @remarks
 * Source: {@link https://grrr.tech/posts/2021/typescript-partial}.
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

/**
 * `RecursivePartial` with exceptions.
 */
export type RecursivePartialExcept<T, K extends keyof T> = RecursivePartial<T> &
  Pick<T, K>;

/**
 * An alternative to TypeScript's `Required` type, with support for nested objects.
 */
export type RecursiveRequired<T> = {
  [P in keyof T]-?: RecursiveRequired<T[P]>;
};

/**
 * Unpacks a type from a Promise, an array, or a function.
 *
 * @remarks
 *
 * Examples:
 * ```
 * type T0 = Unpacked<string>; // string
 * type T1 = Unpacked<string[]>; // string
 * type T2 = Unpacked<() => string>; // string
 * type T3 = Unpacked<Promise<string>>; // string
 * type T4 = Unpacked<Promise<string>[]>; // Promise<string>
 * type T5 = Unpacked<Unpacked<Promise<string>[]>>; // string
 * ```
 *
 * Source: {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html}.
 */
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
