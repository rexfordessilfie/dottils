import { dotter } from "../src";

export const d = dotter(".");

test("correctly dots two string keys", () => {
  expect(d.dot("person", "age")).toEqual("person.age");
});

test("correctly dots with left empty", () => {
  expect(d.dot("", "age")).toEqual(".age");
});

test("correctly dots with right empty", () => {
  expect(d.dot("person", "")).toEqual("person.");
});

test("correctly dots with number", () => {
  expect(d.dot("person", 0)).toEqual("person[0]");
});

test("correctly dots with empty left and number", () => {
  expect(d.dot("", 0)).toEqual(".[0]");
});
