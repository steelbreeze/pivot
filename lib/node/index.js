"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.average = exports.sum = exports.select = exports.map = exports.filter = exports.cube = exports.joinAxes = exports.valuesAxis = exports.columnAxis = void 0;
/**
 * Creates an axis based on the contents of column in a table.
 * @param table The source table, an array of objects.
 * @param key The name to give this axis.
 * @param options An optional get callback to derive the axis values and an optional sort callback.
 */
function columnAxis(table, key, options = {}) {
    return valuesAxis(table.map(options.get || (row => row[key])).filter((value, index, source) => source.indexOf(value) === index).sort(options.sort), key, options.get);
}
exports.columnAxis = columnAxis;
/**
 * Creates an axis from an array of values.
 * @param values The source values.
 * @param key The name to give this dimension.
 * @param get An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
function valuesAxis(values, key, get = row => row[key]) {
    return values.map(value => { return { p: row => get(row) === value, pairs: [{ key, value: value }] }; });
}
exports.valuesAxis = valuesAxis;
/**
 * Join two axes together into a single axis.
 * @param axis1 The first axis.
 * @param axis2 The second axis.
 */
function joinAxes(axis1, axis2) {
    return axis1.reduce((result, s1) => [...result, ...axis2.map(s2 => { return { p: (row) => s1.p(row) && s2.p(row), pairs: [...s1.pairs, ...s2.pairs] }; })], []);
}
exports.joinAxes = joinAxes;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
function cube(table, y, x) {
    return y.map(s => table.filter(s.p)).map(slice => x.map(s => slice.filter(s.p)));
}
exports.cube = cube;
/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 */
function filter(cube, predicate) {
    return cube.map(y => y.map(x => x.filter(predicate)));
}
exports.filter = filter;
/**
 * Queries data from a cube.
 * @param cube The source cube.
 * @param selector A callback function to create a result from each cell of the cube.
 */
function map(cube, selector) {
    return cube.map(y => y.map(selector));
}
exports.map = map;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
function select(selector) {
    return table => table.map(selector);
}
exports.select = select;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
function sum(selector) {
    return table => table ? table.reduce((total, row) => total + selector(row), 0) : null;
}
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
function average(selector) {
    return table => table ? sum(selector)(table) / count(table) : null;
}
exports.average = average;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
function count(table) {
    return table.length || null;
}
exports.count = count;
