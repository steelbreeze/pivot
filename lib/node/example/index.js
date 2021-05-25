"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pivot_1 = require("../pivot");
const fulham_1 = require("./fulham");
// Calculate a person's age from their date of birth
function age(person) {
    return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
// create axes out of the dimensions (axis can be built from multiple dimensions)
const x = pivot_1.axis(pivot_1.dimension(fulham_1.squad, 'position'));
const y = pivot_1.axis(pivot_1.dimension(fulham_1.squad, 'country'));
// create the pivot cube
const cube = pivot_1.pivot(fulham_1.squad, y, x);
// find the average age of players by position by country
const result = pivot_1.query(cube, pivot_1.average(age));
// ugly code to pretty print the result with dimensions
const print = (value) => { const str = String(value || ''); return str.length < 8 ? str : (str.substr(0, 6) + '\u2026'); };
console.log(`\t${x.map(c => print(c.map(i => i.value).join(','))).join('\t')}`);
result.forEach((row, i) => console.log(`${print(y[i].map(j => j.value).join(','))}\t${row.map(print).join('\t')}`));
