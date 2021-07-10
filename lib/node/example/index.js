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
const fulham_1 = require("./fulham");
const pivot = __importStar(require(".."));
// create axes derived from the squad data
const x = pivot.axis.fromTable(fulham_1.squad, 'position');
const y = pivot.axis.fromTable(fulham_1.squad, 'short country', { get: player => player.country.substr(0, 3).toUpperCase() });
// create the pivot cube
const cube = pivot.cube(fulham_1.squad, y, x);
// find the average age of players by position by country
const result = pivot.map(cube, pivot.average(age));
// ugly code to pretty print the result with axes
console.log(`\t${x.map(c => print(c.pairs[0].value)).join('\t')}`);
result.forEach((row, i) => console.log(`${print(y[i].pairs[0].value)}\t${row.map(print).join('\t')}`));
// Calculate a person's age from their date of birth
function age(person) {
    return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
// Print a value in 7 characters and truncate with ellipsis
function print(value) {
    const str = String(value || '');
    return str.length < 8 ? str : (str.substr(0, 6) + '\u2026');
}
