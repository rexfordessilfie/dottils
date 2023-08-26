import { UnionToIntersection } from "utility-types";

export type ArrayElement<T extends any[]> = T extends (infer E)[] ? E : unknown;
export type Key = {
  $key: string;
};

export type IndexableKey<ElementType = unknown> = Key & {
  $index: (idx: number) => inferFormNames<UnionToIntersection<ElementType>>;
};

export type inferFormNames<T> = T extends (infer ElementType)[]
  ? IndexableKey<ElementType>
  : T extends object
  ? {
      [K in keyof T]: T[K] extends (infer ElementType)[]
        ? IndexableKey<ElementType>
        : Key & inferFormNames<T[K]>;
    }
  : unknown;
