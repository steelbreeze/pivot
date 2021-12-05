"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pivot = __importStar(require(".."));
// a simple data set comprising 4 rows with some dimensional data
const data = [
    [1, 1, 'Row 1'],
    [2, 1, 'Row 2'],
    [1, 2, 'Row 3'],
    [2, 2, 'Row 4'],
    [2, 2, 'Row 5']
];
// create a dimension with pre-defined values for the first element in the data.
const x = pivot.dimension([1, 2, 3], 0);
// create a dimension with derived values for the second element in the data.
const y = pivot.dimension(pivot.distinct(data, 1), 1);
// create a cube from the data using the x and y dimensions
const cube = pivot.cube(data, { x, y });
// Display the values of the third element seen in the data
console.log(pivot.map(cube, pivot.select(t => t[2])));
