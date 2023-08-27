export type SplitOpts = {
  separator?: string;
  brackets?: boolean;
};

export function split(key: string, opts: SplitOpts = {}): string[] {
  const { separator = ".", brackets = false } = opts;
  if (brackets) {
    const NON_SEPARATOR_OR_BRACKETS = `[^\\${separator}\\[\\]]`;
    const pattern = new RegExp(
      `^$|^(?=\\${separator})|\\[${NON_SEPARATOR_OR_BRACKETS}+\\]|${NON_SEPARATOR_OR_BRACKETS}+|(?<=\\${separator})$`,
      "g",
    );

    return [...(key.match(pattern) || [])];
  }

  return key.split(separator);
}
