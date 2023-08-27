# dottils

Collection of useful utility functions that work with dot notation objects.

# Usage

## `dot(key1, key2, opts)`

Create a dot-notation key by joining the given keys with a separator or with brackets if the second key is a number.

```ts
/* Creating keys */
dot("a", "b"); // "a.b"
dot("a", ""); // "a."
dot("", "b"); // ".b"
dot("a", 0); // "a[0]"
dot(0, ""); // "0."
dot("", 0); // ".[0]"
```

## `split(key, opts)`

Splits a dot-notation key into an array of keys.

```ts
/* Splitting keys */
split("a.b"); // ["a", "b"]
split("a."); // ["a", ""]
split(".b"); // "b"
split("a", 0); // "a[0]"
split("[0]."); // [0, ""]
split(".[0]"); // ["", 0]
```

## `transform(obj, opts)`

Transforms a flat dot-notation object into a nested object. It also transforms array index accesses.

```ts
/* Merging keys */
transform({
  "a.b.c": 0,
}); // { a: { b: { c: 0 }}}
transform({
  "a[0]": 0,
  "a[1]": 1,
  "a[2]": 2,
}); // {a: [0, 1, 2] }
transform({
  "[0]": 0,
  "[1]": 1,
  "[2]": 2,
}); // [0, 1, 2]
transform({
  "[0]": 0,
  "[2]": 1,
  "[4]": 2,
}); // [0, undefined, 1, undefined, 2]
transform({
  "[0][0]": 0,
  "[1][0]": 1,
  "[2][0]": 2,
}); // [[0], [1], [2]]
transform({
  "[0][0]": 0,
  "[1][1]": 1,
  "[2][2]": 2,
}); // [[0], [undefined, 1], [undefined, undefined, 2]]
```

## `flatKeys(obj, opts)`

Get flattened keys within an object using type-safe expressions.

### From plain object

```ts
const f = flatKeys({
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

1. Defining the schema

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

2. Creating the flat keys with a custom `transform` function.

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
   const f = flatKeys<z.infer<typeof schema>>(schema as any, {
     transform: zodTransform,
   });

   // Access keys
   f.name.$key; // "name"
   f.age.$key; // "age"
   f.nested.car.$key; // "nested.car"
   f.items.$index(0).person.emoji.$key; // "items[0].person.emoji"
   f.items.$index(1).person.emoji.$key; // "items[1].person.emoji"
   ```

## `flatKeysDynamic(opts)`

Like `flatKeys` but only requires a type annotation. Keys are created as you go via a proxy.

```ts
type Person = {
  name: string;
  age: number;
  nested: {
    car: string;
  };
  list: { person: { emoji: string } }[];
};

const f = flatKeysDynamic<Person>();

// Access keys
f.name.$key; // "name"
f.age.$key; // "age"
f.nested.car.$key; // "nested.car"
f.items.$index(0).person.emoji.$key; // "items[0].person.emoji"
f.items.$index(1).person.emoji.$key; // "items[1].person.emoji"
```

## `dotter(opts)`

Returns a dotter configured with the given options. The dotter has all the methods above, but with the options pre-configured.

```ts
const d = dotter({
  arrays: true, // Enable array transformation
  brackets: true, // Enable bracket notation
  separator: ".", // Separator to use
});

d.dot("a", "b"); // "a.b"
d.split("a.b"); // ["a", "b"]
d.transform({ "a.b": 0 }); // { a: { b: 0 }}
// ... and all perviously mentioned methods.
```

# Acknowledgements

This repository is inspired by work over on [mickhansen/dottie.js](https://github.com/mickhansen/dottie.js). If you do not need the extra bracket and arrays support, or the flat keys, I recommend using that library instead!
