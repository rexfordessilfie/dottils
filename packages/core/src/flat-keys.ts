import { dot, DotOpts } from "./dotter";
import { UnionToIntersection } from "utility-types";

type Key = {
  $key: string;
};

type IndexableKey<ElementType = unknown> = Key & {
  $index: (idx: number) => inferFormNames<UnionToIntersection<ElementType>>;
};

type inferFormNames<T> = T extends (infer ElementType)[]
  ? IndexableKey<ElementType>
  : T extends object
  ? {
      [K in keyof T]: T[K] extends (infer ElementType)[]
        ? IndexableKey<ElementType>
        : Key & inferFormNames<T[K]>;
    }
  : unknown;

type CreateFlattenedKeysOpts = {
  dotFn?: typeof dot;
  dotOpts?: DotOpts;
  transform?: <TIn, TOut>(obj: TIn) => TOut;
};

type ArrayElement<T extends any[]> = T extends (infer E)[] ? E : unknown;

/**
 * Generate flattened keys from an object
 * @param root the object from which to generate the keys
 * @param opts options
 * @returns
 */
export function createFlatKeys<S>(root: S, opts?: CreateFlattenedKeysOpts) {
  const { dotFn = dot, dotOpts, transform } = opts || {};

  function _createFlatKeys(
    rawObj: any,
    current: Record<string, any>,
    prevKey?: string,
  ) {
    const obj = transform ? transform(rawObj) : rawObj;

    // We have probably reached the end or invalid value was provided. Nothing to do
    if (typeof obj !== "object") {
      return;
    }

    const keys = Object.keys(obj);

    for (let key of keys) {
      // Build the key at this point
      let dotKey = key;
      if (prevKey) {
        dotKey = dotFn(prevKey, dotKey, dotOpts);
      }

      // Define the base key
      const base: Key = {
        $key: dotKey,
      };

      const rawVal = obj[key];
      const val = transform ? transform(rawVal) : rawVal;

      // Check if we are dealing with a key that has an array value
      if (Array.isArray(val)) {
        const formName: IndexableKey<ArrayElement<typeof val>> = {
          ...base,
          $index(idx: number, opts?: DotOpts) {
            // Dynamically build the rest of the key after index provided
            const next = {};
            const nextKey = dotFn(dotKey, idx, opts);
            val.forEach((v) => {
              _createFlatKeys(v, next, nextKey);
            });
            return next;
          },
        };
        current[key] = formName;
      } else {
        // Treat as regular object and continue
        const formName: Key = {
          ...base,
        };
        current[key] = formName;
        _createFlatKeys(rawVal, current[key], dotKey);
      }
    }
  }

  const final = {};
  _createFlatKeys(root, final);

  return final as inferFormNames<S>;
}
