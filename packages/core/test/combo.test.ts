import { createDotter } from "../src";

test("createDotter works", () => {
  const d = createDotter({
    arrays: true,
    brackets: true,
  });

  expect(
    d.transform({
      "a.b.c": 0,
      "x['y']['z']": 1,
    })
  ).toEqual({ a: { b: { c: 0 } }, x: { y: { z: 1 } } });

  expect(
    d.transform({
      "a['b']['c']": 0,
      "x['y']['z']": 1,
    })
  ).toEqual({ a: { b: { c: 0 } }, x: { y: { z: 1 } } });

  expect(
    d.transform({
      "a[0]": 0,
      "a[1]": 1,
      "a[2]": 2,
    })
  ).toEqual({
    a: [0, 1, 2],
  });

  expect(
    d.transform({
      "[0]": 0,
      "[1]": 1,
      "[2]": 2,
    })
  ).toEqual([0, 1, 2]);

  expect(
    d.transform({
      "[0]": 0,
      "[2]": 1,
      "[4]": 2,
    })
  ).toEqual([0, undefined, 1, undefined, 2]);

  expect(
    d.transform({
      "[0][0]": 0,
      "[1][0]": 1,
      "[2][0]": 2,
    })
  ).toEqual([[0], [1], [2]]);

  expect(
    d.transform({
      "[0][0]": 0,
      "[1][1]": 1,
      "[2][2]": 2,
    })
  ).toEqual([[0], [undefined, 1], [undefined, undefined, 2]]);
});
