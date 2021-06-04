"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pivot_1 = require("../pivot");
const fulham_1 = require("./fulham");
// create axes out of the dimensions derived from the squad data
const x = pivot_1.axis(fulham_1.squad, 'position');
const y = pivot_1.axis(fulham_1.squad, 'country');
//const y = axis(dimension(squad, 'age', age)); // an alternative choice for the y axis using a derived field
// create the pivot cube
const cube = pivot_1.pivot(fulham_1.squad, y, x);
// find the average age of players by position by country
const result = pivot_1.query(cube, pivot_1.average(age));
// ugly code to pretty print the result with axes
console.log(`\t${x.map(c => print(c.meta.value)).join('\t')}`);
result.forEach((row, i) => console.log(`${print(y[i].meta.value)}\t${row.map(print).join('\t')}`));
// Calculate a person's age from their date of birth
function age(person) {
    return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
// Print a value in 7 characters and truncate with ellipsis
function print(value) {
    const str = String(value || '');
    return str.length < 8 ? str : (str.substr(0, 6) + '\u2026');
}
