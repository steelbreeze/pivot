"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pivot = require("..");
const fulham_1 = require("./fulham");
// the source of dimensions are just arrays of values
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const countries = fulham_1.squad.map(player => player.country).filter(distinct).sort();
// create simple dimensions, referencing the atttribute within the source and the unique values they have
const x = positions.map(pivot.criteria('position'));
const y = countries.map(customCriteria('country'));
// create the pivot cube from the squad data using position and country for x and y axes
let cube = pivot.cube(fulham_1.squad, y, x);
// find the average age of players by position by country as at 2021-05-23
const result = pivot.map(cube, pivot.average(age(new Date('2021-05-23'))));
// Creates a callback to calculate a players age from their date of birth as at a given date
function age(asAt) {
    return (player) => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
// pretty print the result with axes
console.log(`\t${positions.map(print).join('\t')}`);
console.log(result.map((row, index) => [y[index].value, ...row].map(print).join('\t')).join('\n'));
// Print a value in 7 characters and truncate with ellipsis
function print(value) {
    const str = String(value || '');
    return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}
// function to create a filter that return only distinct values from an array
function distinct(value, index, source) {
    return source.indexOf(value) === index;
}
// build a custom criteria consisting of the predicate and custom metadata describing the key and value that will be tested
function customCriteria(key) {
    return (value) => Object.assign((player) => player[key] === value, { value });
}
