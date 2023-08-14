type DotOpts = {
  separator?: string;
};
/**
 * Creates a key in a dot-notation object from the
 * given separator and a list of arguments.
 */
export function dot(
  a: string | number = "",
  b: string | number = "",
  opts: DotOpts = {}
): string {
  if (typeof b === "number") {
    return a
      ? `${a}[${b}]` // e.g "a[0]"
      : `${opts.separator}[${b}]`; // e.g ".[0]"
  }
  return `${a}${opts.separator}${b}`;
}

type SplitOpts = {
  cleanArrayIndexes?: boolean;
  separator?: string;
};

export function split(key: string, opts: SplitOpts = {}): (string | number)[] {
  const { cleanArrayIndexes = false, separator = "." } = opts;
  const nonSeparatorOrBoxes = `[^\\${separator}\\[\\]]`;
  const pattern = new RegExp(
    `^$|^(?=\\${separator})|\\[${nonSeparatorOrBoxes}+\\]|${nonSeparatorOrBoxes}+|(?<=\\${separator})$`,
    "g"
  );

  const result = Array.from(key.match(pattern) || []);

  if (cleanArrayIndexes) {
    // TODO
  }

  return result;
}

type MergeOpts = {
  shouldTransformArray?: boolean;
  initialData?: Record<string, any>;
  separator?: string;
};

function isArrayIndex(str: string) {
  return /\[\d+\]/.test(str.toString());
}

/**
 * Transforms a dot-notation object to an nested object
 * with the given dot character.
 */
export function merge(
  data: Record<string, unknown>,
  opts: MergeOpts = {} // TODO: add initial data key
) {
  const { shouldTransformArray = true, separator } = opts;
  const transform = { $: {} as Record<string, any> };

  const keys = Object.keys(data);

  const arrayLikeParents = new Map<string, Record<string, any>>();

  for (let key of keys) {
    const pieces = split(key, {
      cleanArrayIndexes: true,
      separator: separator,
    });

    let current = transform.$;

    const memo = {
      path: "$",
      parent: transform.$,
    };

    for (let index = 0; index < pieces.length; index++) {
      const isLast = index === pieces.length - 1;
      let _piece = pieces[index];

      const piece = _piece?.toString().replace(/^\[("|'|`)?|("|'|`)?\]$/g, "");

      if (
        shouldTransformArray &&
        typeof _piece === "string" &&
        isArrayIndex(_piece)
      ) {
        arrayLikeParents.set(memo.path, memo.parent);
      }

      if (isLast) {
        current[piece] = data[key];
      } else {
        current[piece] = current[piece] || {};
      }

      memo.parent = current;
      current = current[piece];
      memo.path = memo.path
        ? dot(memo.path, piece, { separator: separator })
        : piece;
    }
  }

  if (!shouldTransformArray) {
    return transform.$;
  }

  // Merge the array values:
  const toTransform = Array.from(arrayLikeParents.entries()).reverse(); // Reverse so we process nested objects first

  for (let [key, arrayLikeParent] of toTransform) {
    const pieces = split(key, { separator: separator });

    const arrayLikeKey = pieces.at(-1) ?? "ERROR";

    const isRoot = arrayLikeKey === "$" && pieces.length === 1;

    // Get the object with the array object indexes
    const arrayLike = isRoot ? transform.$ : arrayLikeParent[arrayLikeKey];

    // Create the array
    const maxIndex = Math.max(...(Object.keys(arrayLike) as any)); // Math.max still works on string numbers
    const array = new Array(maxIndex + 1).fill(undefined);

    // Set the indexes to correct values in the array
    Object.entries(arrayLike).forEach(([key, value]) => {
      // TODO: throw if key is not actually a number
      array[Number(key)] = value;
    });

    if (isRoot) {
      transform.$ = array;
    } else {
      arrayLikeParent[arrayLikeKey] = array;
    }
  }

  return transform.$;
}

/**
 * Makes a dot function and a merge function given the dot character.
 */
export function dotter(separator = ".") {
  return {
    dot: (a: string | number, b: string | number, opts?: DotOpts) =>
      dot(a, b, { ...opts, separator }),
    merge: (data: Record<string, any>, opts?: MergeOpts) =>
      merge(data, { ...opts, separator }),
    split: (key: string, opts?: SplitOpts) =>
      split(key, { ...opts, separator }),
  };
}
