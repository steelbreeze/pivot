"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.average = exports.sum = exports.select = exports.map = exports.filter = exports.cube = exports.join = exports.deriveDimension = exports.dimension = void 0;
/**
 * Creates a dimension from an array of values.
 * @param values The source values.
 * @param key The name to give this dimension.
 * @param get An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
function dimension(values, key, get = row => row[key]) {
    return values.map(value => [{ key, value, f: row => get(row) === value }]);
}
exports.dimension = dimension;
/**
 * Creates a derived dimension based on the contents of column in a table.
 * @param table The source table, an array of objects.
 * @param key The name to give this dimension.
 * @param options An optional structure, containing two configuration parameters: get, a callback function used to convert values in the source table to those in the dimension when pivoting; sort, a method used to sort the values in the axis.
 */
function deriveDimension(table, key, options = {}) {
    return dimension(table.map(options.get || (row => row[key])).filter((value, index, source) => source.indexOf(value) === index).sort(options.sort), key, options.get);
}
exports.deriveDimension = deriveDimension;
/**
 * Create a composite dimension from others. This creates a cartesian product of the source dimensions criteria.
 * @param dimensions An array of dimensions to combine into one.
 */
function join(...dimensions) {
    return dimensions.reduce((result, dimension) => result.flatMap(c1 => dimension.map(c2 => [...c1, ...c2])), [[]]);
}
exports.join = join;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 */
function cube(table, axes) {
    return axes.y.map(y => table.filter(row => y.every(criterion => criterion.f(row)))).map(slice => axes.x.map(x => slice.filter(row => x.every(criterion => criterion.f(row)))));
}
exports.cube = cube;
/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 */
function filter(cube, predicate) {
    return cube.map(row => row.map(cell => cell.filter(predicate)));
}
exports.filter = filter;
/**
 * Queries data from a cube.
 * @param cube The source cube.
 * @param selector A callback function to create a result from each cell of the cube.
 */
function map(cube, selector) {
    return cube.map(row => row.map(selector));
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
