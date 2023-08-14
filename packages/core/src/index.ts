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
  const { separator = "." } = opts;
  if (typeof b === "number") {
    return a
      ? `${a}[${b}]` // e.g "a[0]"
      : `${separator}[${b}]`; // e.g ".[0]"
  }
  return `${a}${separator}${b}`;
}

type SplitOpts = {
  separator?: string;
  boxSplit?: boolean;
};

export function split(key: string, opts: SplitOpts = {}): string[] {
  const { separator = ".", boxSplit: splitBoxes = false } = opts;
  if (splitBoxes) {
    const nonSeparatorOrBoxes = `[^\\${separator}\\[\\]]`;
    const pattern = new RegExp(
      `^$|^(?=\\${separator})|\\[${nonSeparatorOrBoxes}+\\]|${nonSeparatorOrBoxes}+|(?<=\\${separator})$`,
      "g"
    );

    return [...(key.match(pattern) || [])];
  }

  return key.split(separator);
}

type MergeOpts = {
  boxSplit?: boolean;
  arrayTransform?: boolean;
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
  object: Record<string, unknown>,
  opts: MergeOpts = {} // TODO: add initial data key
) {
  const { arrayTransform = false, separator = ".", boxSplit = false } = opts;

  const transformed = { $: {} as Record<string, any> },
    keys = Object.keys(object),
    length = keys.length,
    arrayLikeParents = new Map<string, Record<string, any>>();

  for (let i = 0; i < length; i++) {
    let key = keys[i];
    let pieces = split(key, {
      separator: separator,
      boxSplit,
    });

    let piecesLength = pieces.length;

    let current = transformed.$;

    let memoPath = "$";
    let memoParent = transformed.$;

    for (let index = 0; index < piecesLength; index++) {
      const isLast = index === piecesLength - 1;
      let rawPiece = pieces[index];

      let piece = boxSplit
        ? rawPiece.replace(/^\[("|'|`)?|("|'|`)?\]$/g, "")
        : rawPiece;

      if (isLast) {
        current[piece] = object[key];
      } else {
        current[piece] = current[piece] || {};
      }

      if (arrayTransform) {
        isArrayIndex(rawPiece) && arrayLikeParents.set(memoPath, memoParent);
        memoParent = current;
      }

      current = current[piece];

      if (arrayTransform) {
        memoPath = dot(memoPath, piece, { separator });
      }
    }
  }

  if (!arrayTransform) {
    return transformed.$;
  }

  // Merge the array values:
  const toTransform = Array.from(arrayLikeParents.entries()).reverse(); // Reverse so we process nested objects first

  for (let [key, arrayLikeParent] of toTransform) {
    const pieces = split(key, { separator: separator });

    const arrayLikeKey = pieces.at(-1) ?? "ERROR";

    const isRoot = arrayLikeKey === "$" && pieces.length === 1;

    // Get the object with the array object indexes
    const arrayLike = isRoot ? transformed.$ : arrayLikeParent[arrayLikeKey];

    // Create the array
    const maxIndex = Math.max(...(Object.keys(arrayLike) as any)); // Math.max still works on string numbers
    const array = new Array(maxIndex + 1).fill(undefined);

    // Set the indexes to correct values in the array
    Object.entries(arrayLike).forEach(([key, value]) => {
      // TODO: throw if key is not actually a number
      array[Number(key)] = value;
    });

    if (isRoot) {
      transformed.$ = array;
    } else {
      arrayLikeParent[arrayLikeKey] = array;
    }
  }

  return transformed.$;
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
