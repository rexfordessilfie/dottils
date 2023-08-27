import { split, SplitOpts } from "./split";
import { dot, DotOpts } from "./dot";
import { transform, TransformOpts } from "./transform";
import { flatKeys, FlatKeysOpts } from "./flat-keys";
import { flatKeysDynamic, FlatKeysDynamicOpts } from "./flat-keys-dynamic";

type DotterOptions = {
  separator?: TransformOpts["separator"];
  brackets?: TransformOpts["brackets"];
  arrays?: TransformOpts["arrays"];
};

export function dotter(config?: DotterOptions) {
  const dotFn: typeof dot = (
    a?: string | number,
    b?: string | number,
    opts: DotOpts = {},
  ) => dot(a, b, { ...config, ...opts });

  const splitFn: typeof split = (key: string, opts: SplitOpts = {}) =>
    split(key, { ...config, ...opts });

  const transformFn: typeof transform = (
    data: Record<string, any>,
    opts: TransformOpts = {},
  ) => transform(data, { ...config, ...opts });

  const flatKeysFn = <S>(root: S, opts?: FlatKeysOpts) => {
    return flatKeys(root, {
      dotOpts: config,
      dotFn,
    });
  };

  const flatKeysDynamicFn = <S>(opts?: FlatKeysDynamicOpts) => {
    return flatKeysDynamic<S>({
      dotOpts: config,
      dotFn,
    });
  };

  return {
    dot: dotFn,
    transform: transformFn,
    split: splitFn,
    flatKeys: flatKeysFn,
    flatKeysDynamic: flatKeysDynamicFn,
  };
}
