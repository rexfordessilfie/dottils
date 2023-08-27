import { dot, DotOpts } from "./dot";
import { inferFormNames } from "./types";

export type FlatKeysDynamicOpts = {
  dotFn?: typeof dot;
  dotOpts?: DotOpts;
};

/**
 * Generate flattened keys of a given type
 * @param root the object from which to generate the keys
 * @param opts options
 * @returns
 */
export function flatKeysDynamic<S>(opts?: FlatKeysDynamicOpts) {
  const { dotFn = dot, dotOpts } = opts || {};

  function createBuilderProxy<T extends object>(obj: T, prevKey?: string): any {
    return new Proxy<T>(obj, {
      get(target, prop) {
        if (typeof prop !== "string") {
          return Reflect.get(target, prop);
        }

        if (prop === "$key") {
          return Reflect.get(target, prop);
        }

        if (prop === "$index") {
          return (idx: number, opts?: DotOpts) => {
            const dotKey = Reflect.get(target, "$key") as string;

            // Dynamically build the rest of the key after index provided
            const nextKey = dotFn(dotKey, idx, opts);
            return createBuilderProxy({ $key: nextKey }, nextKey);
          };
        }

        // Build the key at this point
        let dotKey = prop;
        if (prevKey) {
          dotKey = dotFn(prevKey, dotKey, dotOpts);
        }

        return createBuilderProxy(
          {
            $key: dotKey,
          },
          dotKey,
        );
      },
    });
  }

  return createBuilderProxy({}) as inferFormNames<S>;
}
