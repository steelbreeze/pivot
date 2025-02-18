"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const fulham_1 = require("./fulham");
const distinct_1 = require("./distinct");
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const countries = fulham_1.squad.map(player => player.country).filter(distinct_1.distinct).sort();
const x = (0, __1.dimension)(positions, (0, __1.property)('position'));
const y = (0, __1.dimension)(countries, (country) => (player) => player.country === country);
const cube = (0, __1.pivot)(fulham_1.squad, y, x);
const result = (0, __1.query)(cube, (0, __1.average)(age(new Date('2021-05-23'))));
function age(asAt = new Date()) {
    return (player) => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}
console.log(`\t${positions.map(print).join('\t')}`);
console.log(result.map((row, index) => [countries[index], ...row].map(print).join('\t')).join('\n'));
function print(value) {
    const str = String(value || '');
    return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}
