import { dotter } from "./src";

const d = dotter({
  arrays: true,
  brackets: true,
  separator: ".",
});

d.transform({
  "a.b.c": 0,
  "x.y.z": 1,
}); // { a: { b: { c: 0 } }, x: { y: { z: 1 } } });

d.transform({
  "a[0]": 0,
  "a[1]": 1,
  "a[2]": 2,
}); // a: [0, 1, 2]

d.transform({
  "[0]": 0,
  "[1]": 1,
  "[2]": 2,
}); // [0, 1, 2]

d.transform({
  "[0]": 0,
  "[2]": 1,
  "[4]": 2,
}); // [0, undefined, 1, undefined, 2]

d.transform({
  "[0][0]": 0,
  "[1][0]": 1,
  "[2][0]": 2,
}); // [[0], [1], [2]]

d.transform({
  "[0][0]": 0,
  "[1][1]": 1,
  "[2][2]": 2,
}); // [[0], [undefined, 1], [undefined, undefined, 2]]
