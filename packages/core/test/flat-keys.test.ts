import { createFlatKeys } from "../src";

import { z } from "zod";

test("flattens keys from an object", () => {
  const f = createFlatKeys({
    name: "Rex",
    age: 12,
    nested: {
      car: "Chevy",
    },
    items: [{ person: { emoji: "🤩" } }, { person: { emoji: "🤪" } }],
  });

  expect(f.name.$key).toEqual("name");
  expect(f.age.$key).toEqual("age");
  expect(f.nested.$key).toEqual("nested");
  expect(f.nested.car.$key).toEqual("nested.car");
  expect(f.items.$key).toEqual("items");
  expect(f.items.$index(0).person.$key).toEqual("items[0].person");
  expect(f.items.$index(2).person.$key).toEqual("items[2].person");
  expect(f.items.$index(0).person.emoji.$key).toEqual("items[0].person.emoji");
});

test("flattens keys with transform (zod)", () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
    nested: z.object({
      car: z.string(),
    }),
    tuple: z.tuple([z.object({ a: z.string() }), z.object({ b: z.string() })]),
    items: z.array(
      z.object({
        person: z.object({
          emoji: z.string().emoji(),
        }),
      }),
    ),
  });

  function zodTransform(obj: any) {
    if (obj instanceof z.ZodObject) {
      return obj.shape;
    }

    if (obj instanceof z.ZodArray) {
      return [obj.element];
    }

    if (obj instanceof z.ZodTuple) {
      return obj.items;
    }
  }

  const f = createFlatKeys<z.infer<typeof schema>>(schema as any, {
    transform: zodTransform,
  });

  expect(f.name.$key).toEqual("name");
  expect(f.age.$key).toEqual("age");
  expect(f.nested.$key).toEqual("nested");
  expect(f.nested.car.$key).toEqual("nested.car");
  expect(f.items.$key).toEqual("items");
  expect(f.items.$index(0).person.$key).toEqual("items[0].person");
  expect(f.items.$index(2).person.$key).toEqual("items[2].person");
  expect(f.items.$index(0).person.emoji.$key).toEqual("items[0].person.emoji");

  expect(f.tuple.$index(0).a.$key).toBe("tuple[0].a");
  expect(f.tuple.$index(1).b.$key).toBe("tuple[1].b");
});
