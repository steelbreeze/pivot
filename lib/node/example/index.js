"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const fulham_1 = require("./fulham");
const distinct_1 = require("./distinct");
const baseDate = new Date('2021-05-23');
const yearDiff = (date1, date2) => new Date(date1.getTime() - date2.getTime()).getUTCFullYear() - 1970;
// calculates a players age from their date of birth as at a given date
const age = (player) => yearDiff(baseDate, player.dateOfBirth);
// the position dimension we want in a defined order
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
// the countries dimension we derive from the squad data and order alphabetically
const countries = fulham_1.squad.map(player => player.country).filter(distinct_1.distinct).sort();
// we then create dimensions which also reference a property in the source data 
const x = (0, __1.dimension)(positions, (0, __1.property)('position')); // using the built-in dimension generator matching a property
const y = (0, __1.dimension)(countries, (country) => (player) => player.country === country); // using a user-defined generator
// create the pivot cube from the squad data using position and country for x and y axes
const cube = (0, __1.pivot)(fulham_1.squad, y, x);
// find the average age of players by position by country as at 2021-05-23
const result = (0, __1.query)(cube, (0, __1.average)(age));
// pretty print the result with axes
console.log(`\t${positions.map(print).join('\t')}`);
console.log(result.map((row, index) => [countries[index], ...row].map(print).join('\t')).join('\n'));
// Print a value in 7 characters and truncate with ellipsis
function print(value) {
    const str = String(value || '');
    return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}
