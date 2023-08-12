const ROOT_KEY = "$" as const;
/**
 * Creates a key in a dot-notation object from the
 * given separator and a list of arguments.
 */
export function dot(
  separator: string,
  a: string | number = "",
  b: string | number = ""
): string {
  if (typeof b === "number") {
    return a
      ? `${a}[${b}]` // e.g "person[0]"
      : `${separator}[${b}]`; // e.g ".[0]"
  }
  return `${a}${separator}${b}`;
}

type SplitOpts = {
  cleanArrayIndexes?: boolean;
};

export function split(
  separator: string,
  key: string,
  opts: SplitOpts = { cleanArrayIndexes: false }
): (string | number)[] {
  const nonSeparatorOrBoxes = `[^\\${separator}\\[\\]]`;
  const pattern = new RegExp(
    `^$|^(?=\\${separator})|\\[${nonSeparatorOrBoxes}+\\]|${nonSeparatorOrBoxes}+|(?<=\\${separator})$`,
    "g"
  );

  const result = Array.from(key.match(pattern) || []);

  if (opts.cleanArrayIndexes) {
    // TODO
  }

  return result;
}

type MergeOpts = {
  flattenArray?: boolean;
};

/**
 * Transforms a dot-notation object to an nested object
 * with the given dot character.
 */
export function merge(
  separator: string,
  data: Record<string, unknown>,
  opts: MergeOpts = { flattenArray: true }
) {
  const result: { $: Record<string, any> } = { [ROOT_KEY]: {} };
  const arrayObjects = new Map<string, Record<string, any>>();

  type ReduceResult = {
    path: string;
    result: Record<string, any>;
    previous: Record<string, any>;
  };

  Object.keys(data).forEach((dataKey) => {
    const path = split(separator, dataKey, { cleanArrayIndexes: true });

    path.reduce(
      (acc, curr, idx) => {
        const isEnd = idx === path.length - 1;

        // Replace box brackets and or quotes
        const key = curr?.toString().replace(/^\[("|'|`)?|("|'|`)?\]$/g, "");

        // Keep track of parent objects with keys we would have to flatten
        if (opts.flattenArray && /\[\d+\]/.test(curr.toString())) {
          arrayObjects.set(acc.path, acc.previous);
        }

        // Set value if end, or continue down the chain with the object at current key or a new one
        acc.result[key] = isEnd ? data[dataKey] : acc.result[key] || {};

        // Keep track of the path for book-keeping (eg. when we come back arround to track arrays to flatten)
        acc.path = acc.path ? dot(separator, acc.path, key) : key;

        return {
          previous: acc.result,
          result: acc.result[key],
          path: acc.path,
        };
      },
      {
        path: ROOT_KEY,
        previous: result[ROOT_KEY],
        result: result[ROOT_KEY],
      } as ReduceResult
    );
  });

  // Merge the array values:
  if (opts.flattenArray) {
    Array.from(arrayObjects.entries())
      .reverse() // Reverse so we process nested objects first
      .forEach(([dotKey, parent]) => {
        const path = split(separator, dotKey);
        const endKey = path.at(-1) ?? "ERROR";

        const isRoot = endKey === ROOT_KEY && path.length === 1;

        // Get the object with the array object indexes
        const child = isRoot ? result[ROOT_KEY] : parent[endKey];

        // Create the array
        const maxIndex = Math.max(...(Object.keys(child) as any)); // Math.max still works on string numbers
        const array = new Array(maxIndex + 1).fill(undefined);

        // Set the indexes to correct values in the array
        Object.entries(child).forEach(([key, value]) => {
          array[Number(key)] = value;
        });

        if (isRoot) {
          result[ROOT_KEY] = array;
        } else {
          parent[endKey] = array;
        }
      });
  }

  return result[ROOT_KEY];
}

/**
 * Makes a dot function and a merge function given the dot character.
 */
export function dotter(separator = ".") {
  return {
    dot: (a: string | number, b: string | number) => dot(separator, a, b),
    merge: (data: Record<string, any>, opts?: MergeOpts) =>
      merge(separator, data, opts),
    split: (key: string, opts?: SplitOpts) => split(separator, key, opts),
  };
}
