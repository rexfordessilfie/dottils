import { transform as transform } from "../src";

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

test("transforms an object with array index and flattens it", () => {
  expect(transform(sample1, { arrays: true, brackets: true })).toEqual({
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

test("transforms an object with boxes", () => {
  expect(transform(sample6, { brackets: true })).toEqual({
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

test("transforms an object without flattening arrays", () => {
  expect(transform(sample1, { arrays: false, brackets: true })).toEqual({
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

test("transforms an object with preceding separator", () => {
  expect(transform(sample2, { arrays: false, brackets: true })).toEqual({
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

test("transforms an object with preceding separator then array", () => {
  expect(transform(sample3, { arrays: false, brackets: true })).toEqual({
    "": {
      0: {
        name: "apple",
      },
      1: {
        name: "google",
      },
    },
  });

  expect(transform(sample3, { arrays: true, brackets: true })).toEqual({
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

test("transforms array only object", () => {
  expect(transform(sample4, { arrays: false, brackets: true })).toEqual({
    0: {
      name: "apple",
    },
    1: {
      name: "google",
    },
  });
});

test("transforms and flattens array only object", () => {
  expect(transform(sample4, { brackets: true, arrays: true })).toEqual([
    {
      name: "apple",
    },
    {
      name: "google",
    },
  ]);
});

test("transforms nested array only objects", () => {
  expect(transform(sample5, { brackets: true, arrays: true })).toEqual([
    [0],
    [undefined, 1],
    [undefined, undefined, 2],
  ]);
});
