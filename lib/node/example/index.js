"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fulham_1 = require("./fulham");
const pivot = require("..");
// create dimensions derived from the squad data
const x = pivot.dimension(pivot.distinct(fulham_1.squad, 'position').sort(), 'position');
const y = pivot.dimension(pivot.distinct(fulham_1.squad, 'country').sort(), 'country');
// create the pivot cube from the squad data using position and country for x and y axes
let cube = pivot.cube(fulham_1.squad, y, x);
// find the average age of players by position by country
const result = pivot.map(cube, pivot.average(age));
// ugly code to pretty print the result with axes
console.log(`\t${x.map(c => print(c[0].value)).join('\t')}`);
result.forEach((row, i) => console.log(`${print(y[i][0].value)}\t${row.map(print).join('\t')}`));
// Calculate a person's age from their date of birth
function age(person) {
    return new Date(new Date('2021-05-23').getTime() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
// Print a value in 7 characters and truncate with ellipsis
function print(value) {
    const str = String(value || '');
    return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}
