export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const roundFraction = (value: number, fractionDigits: number) =>
  Math.round((value + Number.EPSILON) * 10 ** fractionDigits) /
  10 ** fractionDigits;
