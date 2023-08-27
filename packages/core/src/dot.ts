export type DotOpts = {
  separator?: string;
};
/**
 * Creates a key in a dot-notation object from the
 * given separator and a list of arguments.
 */
export function dot(
  a: string | number = "",
  b: string | number = "",
  opts: DotOpts = {},
): string {
  const { separator = "." } = opts;
  if (typeof b === "number") {
    return a
      ? `${a}[${b}]` // e.g "a[0]"
      : `${separator}[${b}]`; // e.g ".[0]"
  }
  return `${a}${separator}${b}`;
}
