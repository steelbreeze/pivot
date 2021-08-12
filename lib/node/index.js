"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.average = exports.sum = exports.select = exports.map = exports.filter = exports.cube = exports.join = exports.dimension = exports.deriveDimension = void 0;
/**
 * Creates a derived dimension based on the contents of column in a table.
 * @param table The source table, an array of objects.
 * @param key The name to give this dimension.
 * @param options An optional get callback to derive the dimension values and an optional sort callback.
 */
function deriveDimension(table, key, options = {}) {
    return dimension(table.map(options.get || (row => row[key])).filter((value, index, source) => source.indexOf(value) === index).sort(options.sort), key, options.get);
}
exports.deriveDimension = deriveDimension;
/**
 * Creates a dimension from an array of values.
 * @param values The source values.
 * @param key The name to give this dimension.
 * @param get An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
function dimension(values, key, get = row => row[key]) {
    return values.map(value => { return { f: row => get(row) === value, data: [{ key, value: value }] }; });
}
exports.dimension = dimension;
/**
 * Join two dimensions together .
 * @param dimension1 The first dimension.
 * @param dimension2 The second dimension.
 */
function join(dimension1, dimension2) {
    return dimension1.reduce((result, s1) => [...result, ...dimension2.map(s2 => { return { f: (row) => s1.f(row) && s2.f(row), data: [...s1.data, ...s2.data] }; })], []);
}
exports.join = join;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param xAxis The dimension to use as the xAxis.
 * @param yAxis The dimension to use as the yAxis.
 */
function cube(table, xAxis, yAxis) {
    return yAxis.map(s => table.filter(s.f)).map(slice => xAxis.map(s => slice.filter(s.f)));
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
