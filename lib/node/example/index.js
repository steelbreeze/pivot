"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fulham_1 = require("./fulham");
const pivot = require("..");
// create dimensions derived from the squad data
const axes = {
    x: pivot.dimension(pivot.distinct(fulham_1.squad, 'position').sort(), 'position'),
    y: pivot.dimension(pivot.distinct(fulham_1.squad, 'country').sort(), 'country')
};
// create the pivot cube from the squad data using position and country for x and y axes
let cube = pivot.cube(fulham_1.squad, axes);
// find the average age of players by position by country
const result = pivot.map(cube, pivot.average(age));
// ugly code to pretty print the result with axes
console.log(`\t${axes.x.map(c => print(c[0].value)).join('\t')}`);
result.forEach((row, i) => console.log(`${print(axes.y[i][0].value)}\t${row.map(print).join('\t')}`));
// Calculate a person's age from their date of birth
function age(person) {
    return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
// Print a value in 7 characters and truncate with ellipsis
function print(value) {
    const str = String(value || '');
    return str.length < 8 ? str : (str.substr(0, 6) + '\u2026');
}
