# dottils

Collection of useful utility functions that work with dot notation objects.

# Usage

## `createDotter`

```ts
const d = createDotter({
  arrays: true, // Enable array transformation
  brackets: true, // Enable bracket notation
  separator: ".", // Separator to use
});
```

### `dot(key1, key2, opts)`

```ts
/* Creating keys */
d.dot("a", "b"); // "a.b"
d.dot("a", ""); // "a."
d.dot("", "b"); // ".b"
d.dot("a", 0); // "a[0]"
d.dot(0, ""); // "0."
d.dot("", 0); // ".[0]"
```

### `split(key, opts)`

```ts
/* Splitting keys */
d.split("a.b"); // ["a", "b"]
d.split("a."); // ["a", ""]
d.split(".b"); // "b"
d.split("a", 0); // "a[0]"
d.split("[0]."); // [0, "."]
d.split(".[0]"); // [".", 0]
```

### `transform(obj, opts)`

```ts
/* Merging keys */
d.transform({
  "a.b.c": 0,
}); // { a: { b: { c: 0 }}}
d.transform({
  "a[0]": 0,
  "a[1]": 1,
  "a[2]": 2,
}); // {a: [0, 1, 2] }
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
```

## `createFlatKeys(obj, opts)`

Get flattened keys within an object using type-safe expressions.

### From plain object

```ts
const f = createFlatKeys({
  name: "Rex",
  age: 12,
  nested: {
    car: "Chevy",
  },
  list: [{ person: { emoji: "🤩" } }, { person: { emoji: "🤪" } }],
});

// Access keys
f.name.$key; // "name"
f.age.$key; // "age"
f.nested.car.$key; // "nested.car"
f.items.$index(0).person.emoji.$key; // "items[0].person.emoji"
f.items.$index(1).person.emoji.$key; // "items[1].person.emoji"
```

### From zod schema

Defining the schema

```ts
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
```

Creating the flat keys with a custom `transform` function.

The transform is called on each zod schema before properties are extracted.

```ts
// Transform zod object, array, etc to their shape so we can access properties on them
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

// Create flat keys with type transform (and extra type annotations for inference)
const f = createFlatKeys<z.infer<typeof schema>>(schema as any, {
  transform: zodTransform,
});

// Access keys
f.name.$key; // "name"
f.age.$key; // "age"
f.nested.car.$key; // "nested.car"
f.items.$index(0).person.emoji.$key; // "items[0].person.emoji"
f.items.$index(1).person.emoji.$key; // "items[1].person.emoji"
```

## `createDynamicFlatKeys(opts)`

Like `createFlatKeys` but only requires a type annotation. Keys are created as you go via a proxy.

```ts
type Person = {
  name: string;
  age: number;
  nested: {
    car: string;
  };
  list: { person: { emoji: string } }[];
};

const f = createDynamicFlatKeys<Person>();

// Access keys
f.name.$key; // "name"
f.age.$key; // "age"
f.nested.car.$key; // "nested.car"
f.items.$index(0).person.emoji.$key; // "items[0].person.emoji"
f.items.$index(1).person.emoji.$key; // "items[1].person.emoji"
```

# Acknowledgements

This repository is inspired by work over on [mickhansen/dottie.js](https://github.com/mickhansen/dottie.js). If you do not need the extra bracket and arrays support, or the flat keys, I recommend using that library instead!
