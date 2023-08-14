import dottie from "dottie";
import { trace } from "ts-wrappers";
import { merge } from "./src";

const basic = {
  "workspace.apple.teams.0.0.name": "Rex",
  "workspace.apple.teams.0.1.name": "Dan",
  "workspace.apple.teams.0.2.name": "Bella",
  "workspace.apple.teams.0.4.name": "Harvey",
  "workspace.apple.teams.1.3.name": "Jane",
};

const withBoxes = {
  'workspace["apple"].teams.0.0.name': "Rex",
  "workspace['apple'].teams.0.1.name": "Dan",
  "workspace[`apple`].teams.0.2.name": "Bella",
  "workspace.apple.teams.0.4.name": "Harvey",
  "workspace.apple.teams.1.3.name": "Jane",
};

const withArrays = {
  'workspace["apple"].teams[0][0].name': "Rex",
  "workspace['apple'].teams[0][1].name": "Dan",
  "workspace[`apple`].teams[0][2].name": "Bella",
  "workspace.apple.teams[0][4].name": "Harvey",
  "workspace.apple.teams[1][3].name": "Jane",
};

const dottieTransform = trace(dottie.transform);
const dotterMerge = trace(merge);

console.log(dottieTransform(basic));
console.log(dotterMerge(basic));
console.log(dotterMerge(withBoxes, { boxSplit: true }));
console.log(dotterMerge(withArrays, { boxSplit: true, arrayTransform: true }));
