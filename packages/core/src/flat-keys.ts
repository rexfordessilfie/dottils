import { dot, DotOpts } from "./dotter";

type Key = {
  $key: string;
};

type KeyAndIndex<ElementType = unknown> = Key & {
  $index: (idx: number) => inferFormNames<ElementType>;
};

type inferFormNames<T> = T extends (infer ElementType)[]
  ? KeyAndIndex<ElementType>
  : T extends object
  ? {
      [K in keyof T]: T[K] extends (infer ElementType)[]
        ? KeyAndIndex<ElementType>
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
        const formName: KeyAndIndex<ArrayElement<typeof val>> = {
          ...base,
          $index(idx: number, opts?: DotOpts) {
            // Dynamically build the rest of the key after index provided
            const next = {};
            _createFlatKeys(val[0], next, dotFn(dotKey, idx, opts));
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

  let final = {} as Record<string, any>; // TODO: custom derived type
  _createFlatKeys(root, final);

  return final as inferFormNames<S>;
}
