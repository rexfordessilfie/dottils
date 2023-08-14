import { dotter } from "../src";

export const d = dotter(".");

// Everything together
const sample1 = {
  'workspace["apple"].teams[0][0].name': "Rex",
  "workspace['apple'].teams[0][1].name": "Dan",
  "workspace[`apple`].teams[0][2].name": "Bella",
  "workspace.apple.teams[0][4].name": "Harvey",
  "workspace.apple.teams[1][3].name": "Jane",
};

// Preceeding "."
const sample2 = {
  ".workspace[0].name": "apple",
  ".workspace[1].name": "google",
};

// Preceeding "." into array
const sample3 = {
  ".[0].name": "apple",
  ".[1].name": "google",
};

// Preceeding Array only
const sample4 = {
  "[0].name": "apple",
  "[1].name": "google",
};

const sample5 = {
  "[0][0]": 0,
  "[1][1]": 1,
  "[2][2]": 2,
};

test("correctly merges an object with array index and flattens it", () => {
  expect(d.merge(sample1)).toEqual({
    workspace: {
      apple: {
        teams: [
          [
            { name: "Rex" },
            { name: "Dan" },
            { name: "Bella" },
            undefined,
            { name: "Harvey" },
          ],
          [undefined, undefined, undefined, { name: "Jane" }],
        ],
      },
    },
  });
});

test("correctly merges an object without flattening arrays", () => {
  expect(d.merge(sample1, { shouldTransformArray: false })).toEqual({
    workspace: {
      apple: {
        teams: {
          0: {
            0: { name: "Rex" },
            1: { name: "Dan" },
            2: { name: "Bella" },
            4: { name: "Harvey" },
          },
          1: {
            3: { name: "Jane" },
          },
        },
      },
    },
  });
});

test("correctly merges an object with preceding separator", () => {
  expect(d.merge(sample2, { shouldTransformArray: false })).toEqual({
    "": {
      workspace: {
        0: {
          name: "apple",
        },
        1: {
          name: "google",
        },
      },
    },
  });
});

test("correctly merges an object with preceding separator then array", () => {
  expect(d.merge(sample3, { shouldTransformArray: false })).toEqual({
    "": {
      0: {
        name: "apple",
      },
      1: {
        name: "google",
      },
    },
  });

  expect(d.merge(sample3)).toEqual({
    "": [
      {
        name: "apple",
      },
      {
        name: "google",
      },
    ],
  });
});

test("correctly merges array only object", () => {
  expect(d.merge(sample4, { shouldTransformArray: false })).toEqual({
    0: {
      name: "apple",
    },
    1: {
      name: "google",
    },
  });
});

test("correctly merges and flattens array only object", () => {
  expect(d.merge(sample4)).toEqual([
    {
      name: "apple",
    },
    {
      name: "google",
    },
  ]);
});

test("correctly merges nested array only objects", () => {
  expect(d.merge(sample5)).toEqual([
    [0],
    [undefined, 1],
    [undefined, undefined, 2],
  ]);
});
