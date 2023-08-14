import { dot } from "../src";

test("dots two string keys", () => {
  expect(dot("a", "b")).toEqual("a.b");
});

test("dots with left empty", () => {
  expect(dot("", "b")).toEqual(".b");
});

test("dots with right empty", () => {
  expect(dot("a", "")).toEqual("a.");
});

test("dots with number", () => {
  expect(dot("a", 0)).toEqual("a[0]");
});

test("dots with empty left and number", () => {
  expect(dot("", 0)).toEqual(".[0]");
});

test("dots with empty right and number", () => {
  expect(dot(0, "")).toEqual("0.");
});
