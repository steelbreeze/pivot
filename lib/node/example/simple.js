"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const distinct_1 = require("./distinct");
// a simple data set comprising 4 rows with some dimensional data
const data = [
    { a: 1, b: 1, c: 'Row 1' },
    { a: 2, b: 1, c: 'Row 2' },
    { a: 1, b: 2, c: 'Row 3' },
    { a: 2, b: 2, c: 'Row 4' },
    { a: 2, b: 2, c: 'Row 5' }
];
// create a dimension with pre-defined values for the property 'a' in the data.
const x = [1, 2, 3].map((0, __1.property)('a'));
// create a dimension with derived values for the property 'b' in the data.
const y = data.map(row => row.b).filter(distinct_1.distinct).map((0, __1.property)('b'));
// create a cube from the data using the x and y dimensions
const cube = (0, __1.pivot)(data, x, y);
// Display the values of 'c' seen in the data
console.log((0, __1.query)(cube, records => records.map(t => t.c)));
