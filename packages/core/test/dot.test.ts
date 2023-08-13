import { dotter } from "../src";

export const d = dotter(".");

test("correctly dots two string keys", () => {
  expect(d.dot("a", "b")).toEqual("a.b");
});

test("correctly dots with left empty", () => {
  expect(d.dot("", "b")).toEqual(".b");
});

test("correctly dots with right empty", () => {
  expect(d.dot("a", "")).toEqual("a.");
});

test("correctly dots with number", () => {
  expect(d.dot("a", 0)).toEqual("a[0]");
});

test("correctly dots with empty left and number", () => {
  expect(d.dot("", 0)).toEqual(".[0]");
});

test("correctly dots with empty right and number", () => {
  expect(d.dot(0, "")).toEqual("0.");
});
