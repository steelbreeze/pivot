"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function test(scale) {
    const data = [];
    const dimensionData = [];
    for (let i = 0; i < scale; i++) {
        for (let j = 0; j < scale; j++) {
            for (let k = 0; k < scale; k++) {
                data.push({ i, j, k });
            }
        }
        dimensionData.push(i);
    }
    const x = dimensionData.map(value => element => element.i === value);
    const y = dimensionData.map(value => element => element.j === value);
    const start = performance.now();
    (0, __1.pivot)(data, y, x);
    const end = performance.now();
    console.log(`Create cube with ${Math.pow(scale, 3)} records: ${Math.round((end - start) * 1000) / 1000}ms`);
}
test(1);
test(10);
test(100);
