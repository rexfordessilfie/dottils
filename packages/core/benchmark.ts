import dottie from "dottie";
import { trace } from "ts-wrappers";
import { transform } from "./src";

const basic = {
  "workspace.apple.teams.0.0.name": "Rex",
  "workspace.apple.teams.0.1.name": "Dan",
  "workspace.apple.teams.0.2.name": "Bella",
  "workspace.apple.teams.0.4.name": "Harvey",
  "workspace.apple.teams.1.3.name": "Jane",
};

const withBrackets = {
  'workspace["apple"].teams.0.0.name': "Rex",
  "workspace['apple'].teams.0.1.name": "Dan",
  "workspace[`apple`].teams.0.2.name": "Bella",
  "workspace.apple.teams.0.4.name": "Harvey",
  "workspace.apple.teams.1.3.name": "Jane",
};

const withBracketsAndArrays = {
  'workspace["apple"].teams[0][0].name': "Rex",
  "workspace['apple'].teams[0][1].name": "Dan",
  "workspace[`apple`].teams[0][2].name": "Bella",
  "workspace.apple.teams[0][4].name": "Harvey",
  "workspace.apple.teams[1][3].name": "Jane",
};

const dottieTransform = trace(dottie.transform);
const dotterTransform = trace(transform);

console.log("\n---BASIC---");
console.log(dottieTransform(basic));
console.log(dotterTransform(basic));

console.log("\n---BRACKETS---");
console.log(dotterTransform(withBrackets, { arrays: true }));

console.log("\n---BRACKETS + ARRAYS---");
console.log(
  dotterTransform(withBracketsAndArrays, { brackets: true, arrays: true })
);

console.log("");
