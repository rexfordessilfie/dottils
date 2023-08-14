import { dotter } from "../src";

export const d = dotter(".");

test("correctly splits empty string into array of empty string", () => {
  expect(d.split("")).toEqual([""]);
});

test("correctly splits into two string keys", () => {
  expect(d.split("person.age")).toEqual(["person", "age"]);
});

test("correctly splits with left empty", () => {
  expect(d.split(".age")).toEqual(["", "age"]);
});

test("correctly dots with right empty", () => {
  expect(d.split("person.")).toEqual(["person", ""]);
});

test("correctly splits with number", () => {
  expect(d.split("person[0]", { boxSplit: true })).toEqual(["person", "[0]"]);
});

test("correctly splits with empty left and number", () => {
  expect(d.split(".[0]")).toEqual(["", "[0]"]);
});
