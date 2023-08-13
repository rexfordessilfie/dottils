# dotter

Utility functions for converting flattened dot notation objects to nested objects.

# Example

```ts
const d = dotter(".");

/* Creating keys */
d.dot("a", "b"); // "a.b"
d.dot("a", ""); // "a."
d.dot("", "b"); // ".b"
d.dot("a", 0); // "a[0]"
d.dot(0, ""); // "0."
d.dot("", 0); // ".[0]"

/* Splitting keys */
d.split("a.b"); // ["a", "b"]
d.split("a."); // ["a", ""]
d.split(".b"); // "b"
d.split("a", 0); // "a[0]"
d.split("[0]."); // [0, "."]
d.split(".[0]"); // [".", 0]

/* Merging objects */
d.merge({
  "a.b.c": 0,
}); // { a: { b: { c: 1 }}}
d.merge({
  "a[0]": 0,
  "a[1]": 1,
  "a[2]": 2,
}); // {a: [0, 1, 2] }
d.merge({
  "[0]": 0,
  "[1]": 1,
  "[2]": 2,
}); // [0, 1, 2]
d.merge({
  "[0]": 0,
  "[2]": 1,
  "[4]": 2,
}); // [0, undefined, 1, undefined, 2]
d.merge({
  "[0][0]": 0,
  "[1][0]": 1,
  "[2][0]": 2,
}); // [[0], [1], [2]]
d.merge({
  "[0][0]": 0,
  "[1][1]": 1,
  "[2][2]": 2,
}); // [[0], [undefined, 1], [undefined, undefined, 2]]
```
