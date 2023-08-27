import { flatKeysDynamic } from "../src";

import { z } from "zod";

type Data = {
  name: string;
  age: number;
  nested: {
    car: string;
  };
  items: { person: { emoji: string } }[];
  tuple: [{ a: string }, { b: string }];
};
test("flattens keys from an object", () => {
  const f = flatKeysDynamic<Data>();

  expect(f.name.$key).toEqual("name");
  expect(f.age.$key).toEqual("age");
  expect(f.nested.$key).toEqual("nested");
  expect(f.nested.car.$key).toEqual("nested.car");
  expect(f.items.$key).toEqual("items");
  expect(f.items.$index(0).person.$key).toEqual("items[0].person");
  expect(f.items.$index(2).person.$key).toEqual("items[2].person");
  expect(f.items.$index(0).person.emoji.$key).toEqual("items[0].person.emoji");
});
