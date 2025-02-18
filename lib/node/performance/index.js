"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function test(scale) {
    const data = [];
    const x = [];
    const y = [];
    const t2 = `Create cube with ${Math.pow(scale, 3)} records`;
    for (let i = 0; i < scale; i++) {
        for (let j = 0; j < scale; j++) {
            for (let k = 0; k < scale; k++) {
                data.push({ i, j, k });
            }
        }
        x.push(record => record.i === i);
        y.push(record => record.j === i);
    }
    console.time(t2);
    (0, __1.pivot)(data, y, x);
    console.timeEnd(t2);
}
test(100);
test(10);
test(1);
