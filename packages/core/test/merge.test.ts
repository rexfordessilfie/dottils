import { merge } from "../src";

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

const sample6 = {
  'workspace["apple"].teams.0.0.name': "Rex",
  "workspace['apple'].teams.0.1.name": "Dan",
  "workspace[`apple`].teams.0.2.name": "Bella",
  "workspace.apple.teams.0.4.name": "Harvey",
  "workspace.apple.teams.1.3.name": "Jane",
};

test("correctly merges an object with array index and flattens it", () => {
  expect(merge(sample1, { arrayTransform: true, boxSplit: true })).toEqual({
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

test("correctly merges an object with boxes", () => {
  expect(merge(sample6, { boxSplit: true })).toEqual({
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

test("correctly merges an object without flattening arrays", () => {
  expect(merge(sample1, { arrayTransform: false, boxSplit: true })).toEqual({
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
  expect(merge(sample2, { arrayTransform: false, boxSplit: true })).toEqual({
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
  expect(merge(sample3, { arrayTransform: false, boxSplit: true })).toEqual({
    "": {
      0: {
        name: "apple",
      },
      1: {
        name: "google",
      },
    },
  });

  expect(merge(sample3, { arrayTransform: true, boxSplit: true })).toEqual({
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
  expect(merge(sample4, { arrayTransform: false, boxSplit: true })).toEqual({
    0: {
      name: "apple",
    },
    1: {
      name: "google",
    },
  });
});

test("correctly merges and flattens array only object", () => {
  expect(merge(sample4, { boxSplit: true, arrayTransform: true })).toEqual([
    {
      name: "apple",
    },
    {
      name: "google",
    },
  ]);
});

test("correctly merges nested array only objects", () => {
  expect(merge(sample5, { boxSplit: true, arrayTransform: true })).toEqual([
    [0],
    [undefined, 1],
    [undefined, undefined, 2],
  ]);
});
