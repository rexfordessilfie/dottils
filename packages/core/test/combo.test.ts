import { dotter } from "../src";

test("dotter transform", () => {
  const d = dotter({
    arrays: true,
    brackets: true,
    separator: "_",
  });

  expect(
    d.transform({
      a_b_c: 0,
      "x['y']['z']": 1,
      "m_n[0]": 2,
    }),
  ).toEqual({ a: { b: { c: 0 } }, x: { y: { z: 1 } }, m: { n: [2] } });

  expect(
    d.transform({
      "[0]": 0,
      "[1]": 1,
      "[2]": 2,
    }),
  ).toEqual([0, 1, 2]);
});

test("dotter dot", () => {
  const d = dotter({
    arrays: true,
    brackets: true,
    separator: "_",
  });

  expect(d.dot("a", "b")).toEqual("a_b");
  expect(d.dot("a", 0)).toEqual("a[0]");

  // Overriding the separator
  expect(d.dot("a", "b", { separator: "." })).toEqual("a.b");
});

test("dotter split", () => {
  const d = dotter({
    arrays: true,
    brackets: true,
    separator: "_",
  });

  expect(d.split("a_b")).toEqual(["a", "b"]);
  expect(d.split("a[0]")).toEqual(["a", "[0]"]);

  // Overriding the brackets setting
  expect(d.split("a[0]", { brackets: false })).toEqual(["a[0]"]);
});

test("dotter flatKeys", () => {
  const d = dotter({
    arrays: true,
    brackets: true,
    separator: "_",
  });

  const f = d.flatKeys({
    name: "John",
    age: 42,
    nested: {
      car: "BMW",
    },
    items: [{ person: { emoji: "🤩" } }, { person: { emoji: "🤪" } }],
  });

  expect(f.name.$key).toEqual("name");
  expect(f.age.$key).toEqual("age");
  expect(f.nested.$key).toEqual("nested");
  expect(f.nested.car.$key).toEqual("nested_car");
  expect(f.items.$key).toEqual("items");
  expect(f.items.$index(0).person.$key).toEqual("items[0]_person");
  expect(f.items.$index(2).person.$key).toEqual("items[2]_person");
});

test("dotter flatKeysDynamic", () => {
  const d = dotter({
    arrays: true,
    brackets: true,
    separator: "_",
  });

  const f = d.flatKeysDynamic<{
    name: string;
    age: number;
    nested: {
      car: string;
    };
    items: { person: { emoji: string } }[];
  }>();

  expect(f.name.$key).toEqual("name");
  expect(f.age.$key).toEqual("age");
  expect(f.nested.$key).toEqual("nested");
  expect(f.nested.car.$key).toEqual("nested_car");
  expect(f.items.$key).toEqual("items");
  expect(f.items.$index(0).person.$key).toEqual("items[0]_person");
  expect(f.items.$index(2).person.$key).toEqual("items[2]_person");
});
