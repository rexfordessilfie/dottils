import { split } from "../src";

test("splits empty string into array of empty string", () => {
  expect(split("")).toEqual([""]);
});

test("splits into two string keys", () => {
  expect(split("person.age")).toEqual(["person", "age"]);
});

test("splits with left empty", () => {
  expect(split(".age")).toEqual(["", "age"]);
});

test("correctly dots with right empty", () => {
  expect(split("person.")).toEqual(["person", ""]);
});

test("splits with number", () => {
  expect(split("person[0]", { brackets: true })).toEqual(["person", "[0]"]);
});

test("splits with empty left and number", () => {
  expect(split(".[0]")).toEqual(["", "[0]"]);
});
