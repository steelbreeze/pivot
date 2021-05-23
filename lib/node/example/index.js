"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pivot = __importStar(require("../pivot"));
const fulham_1 = require("./fulham");
// Calculate a person's age from their date of birth
function age(person) {
    return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
// extract dimensions from the test data
const position = pivot.dimension(fulham_1.squad, 'position');
const country = pivot.dimension(fulham_1.squad, 'country', player => player.nationality);
// create axes out of the dimensions (note, you can use multiple dimensions in a single axis)
const x = pivot.axis(position);
const y = pivot.axis(country);
// create a pivot cube
const cube = pivot.pivot(fulham_1.squad, x, y);
// query data out of the cube
const result = pivot.select(cube, pivot.average(age));
// ugly code to pretty print the result with dimensions
console.log(`\t${position.map(pos => pos.value.substr(0, 7)).join('\t')}`);
result.forEach((row, num) => console.log(`${country[num].value.substr(0, 7)}\t${row.join('\t')}`));
