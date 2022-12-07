"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pivot = require("..");
const data = [];
const x = [];
const y = [];
console.time('Create data');
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        for (let k = 0; k < 100; k++) {
            data.push({ i, j, k });
        }
    }
    x.push(record => record.i === i);
    y.push(record => record.j === i);
}
console.timeEnd('Create data');
console.time('Create cube');
pivot.cube(data, y, x);
console.timeEnd('Create cube');
