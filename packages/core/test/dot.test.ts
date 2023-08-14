import { dot } from "../src";

test("correctly dots two string keys", () => {
  expect(dot("a", "b")).toEqual("a.b");
});

test("correctly dots with left empty", () => {
  expect(dot("", "b")).toEqual(".b");
});

test("correctly dots with right empty", () => {
  expect(dot("a", "")).toEqual("a.");
});

test("correctly dots with number", () => {
  expect(dot("a", 0)).toEqual("a[0]");
});

test("correctly dots with empty left and number", () => {
  expect(dot("", 0)).toEqual(".[0]");
});

test("correctly dots with empty right and number", () => {
  expect(dot(0, "")).toEqual("0.");
});
