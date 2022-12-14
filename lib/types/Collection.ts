/**
 * Extracts the union of all values of an object type.
 */
export type ValueOf<T> = T[keyof T];
