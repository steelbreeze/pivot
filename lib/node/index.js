"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.count = exports.sum = exports.map = exports.cube = exports.criteria = void 0;
/**
 * Create a callback to used in a map operation to create the criteria for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this criteria on.
 */
const criteria = (key) => value => record => record[key] === value;
exports.criteria = criteria;
/**
 * Pivots a table by two axes returning a cube.
 * @param records The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 */
const cube = (records, y, x) => slicer(y)([...records]).map(slicer(x));
exports.cube = cube;
/**
 * Slices a record set by criteria.
 * @hidden
 */
const slicer = (dimension) => records => dimension.map(criteria => {
    let length = 0, result = records.filter(record => criteria(record) || !(records[length++] = record));
    records.length = length;
    return result;
});
/**
 * Queries data from a cube.
 * @param cube The source data, a matrix of records.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (cube, query) => cube.map(matrix => matrix.map(query));
exports.map = map;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
const sum = (selector) => records => records.reduce((total, source) => total + selector(source), 0);
exports.sum = sum;
/**
 * A function to count the number of records in a cube cell.
 */
const count = records => records.length;
exports.count = count;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
const average = (selector) => records => (0, exports.sum)(selector)(records) / (0, exports.count)(records);
exports.average = average;
