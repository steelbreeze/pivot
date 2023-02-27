"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pivot = require("..");
function test(scale) {
    const data = [];
    const x = [];
    const y = [];
    console.time(`Create data with ${Math.pow(scale, 3)} records`);
    for (let i = 0; i < scale; i++) {
        for (let j = 0; j < scale; j++) {
            for (let k = 0; k < scale; k++) {
                data.push({ i, j, k });
            }
        }
        x.push(record => record.i === i);
        y.push(record => record.j === i);
    }
    console.timeEnd(`Create data with ${Math.pow(scale, 3)} records`);
    console.time('Create cube');
    pivot.cube(data, y, x);
    console.timeEnd('Create cube');
}
test(100);
test(10);
test(1);