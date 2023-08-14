import { split } from "../src";

test("correctly splits empty string into array of empty string", () => {
  expect(split("")).toEqual([""]);
});

test("correctly splits into two string keys", () => {
  expect(split("person.age")).toEqual(["person", "age"]);
});

test("correctly splits with left empty", () => {
  expect(split(".age")).toEqual(["", "age"]);
});

test("correctly dots with right empty", () => {
  expect(split("person.")).toEqual(["person", ""]);
});

test("correctly splits with number", () => {
  expect(split("person[0]", { boxSplit: true })).toEqual(["person", "[0]"]);
});

test("correctly splits with empty left and number", () => {
  expect(split(".[0]")).toEqual(["", "[0]"]);
});
