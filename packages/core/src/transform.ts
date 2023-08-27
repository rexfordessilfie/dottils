import { dot } from "./dot";
import { split } from "./split";
import { raise } from "./utils";

export type TransformOpts = {
  brackets?: boolean;
  arrays?: boolean;
  separator?: string;
};

function isArrayIndex(str: string) {
  return /\[\d+\]/.test(str.toString());
}

/**
 * Transforms a dot-notation object to an nested object
 * with the given dot character.
 */
export function transform(
  object: Record<string, unknown>,
  opts: TransformOpts = {}, // TODO: add initial data key
) {
  const { arrays = false, separator = ".", brackets = false } = opts;

  const transformed = { $: {} as Record<string, any> },
    keys = Object.keys(object),
    length = keys.length,
    arrayLikeParents = new Map<string, Record<string, any>>();

  for (let i = 0; i < length; i++) {
    const key = keys[i],
      pieces = split(key, {
        separator: separator,
        brackets: brackets,
      }),
      piecesLength = pieces.length;

    let index,
      current = transformed.$,
      memoPath = "$",
      memoParent = transformed.$;

    for (index = 0; index < piecesLength; index++) {
      const isLast = index === piecesLength - 1,
        rawPiece = pieces[index],
        piece = brackets
          ? rawPiece.replace(/^\[("|'|`)?|("|'|`)?\]$/g, "")
          : rawPiece;

      current[piece] = isLast ? object[key] : current[piece] || {};

      if (arrays) {
        isArrayIndex(rawPiece) && arrayLikeParents.set(memoPath, memoParent);
        memoParent = current;
      }

      current = current[piece];

      if (arrays) {
        memoPath = dot(memoPath, piece, { separator });
      }
    }
  }

  if (arrays) {
    // Merge the array values:
    const toTransform = Array.from(arrayLikeParents.entries()).reverse(); // Reverse so we process nested objects first

    for (let [key, arrayLikeParent] of toTransform) {
      const pieces = split(key, { separator: separator });

      const arrayLikeKey = pieces.at(-1) ?? raise("missing array-like key");

      const isRoot = arrayLikeKey === "$" && pieces.length === 1;

      // Get the object with the array object indexes
      const arrayLike = isRoot ? transformed.$ : arrayLikeParent[arrayLikeKey];

      // Create the array
      const maxIndex = Math.max(...(Object.keys(arrayLike) as any)); // Math.max still works on string numbers
      const array = new Array(maxIndex + 1).fill(undefined);

      // Set the indexes to correct values in the array
      Object.entries(arrayLike).forEach(([key, value]) => {
        const index = Number(key);
        if (isNaN(index)) {
          raise(`invalid array index: ${key}`);
        }
        array[index] = value;
      });

      if (isRoot) {
        transformed.$ = array;
      } else {
        arrayLikeParent[arrayLikeKey] = array;
      }
    }
  }

  return transformed.$;
}
