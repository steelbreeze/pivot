"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.average = exports.sum = exports.select = exports.map = exports.filter = exports.slice = exports.cube = exports.join = exports.dimension = exports.distinct = void 0;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
function distinct(table, key, getValue = row => row[key]) {
    return table.map(getValue).filter((value, index, source) => source.indexOf(value) === index);
}
exports.distinct = distinct;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
function dimension(values, key, getValue = row => row[key]) {
    return values.map(value => [{ key, value, predicate: row => getValue(row) === value }]);
}
exports.dimension = dimension;
/**
 * Create a composite dimension from others. This creates a cartesian product of the source dimensions criteria.
 * @param dimensions An array of dimensions to combine into one.
 * @returns Returns a complex dimension with criteria being the cartesian product of the source dimensions.
 */
function join(...dimensions) {
    return dimensions.reduce((result, dimension) => result.flatMap(c1 => dimension.map(c2 => [...c1, ...c2])));
}
exports.join = join;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
function cube(table, axes) {
    return slice(table, axes.y).map(table => slice(table, axes.x));
}
exports.cube = cube;
/**
 * Slices data by the criteria specified in a dimension.
 * @param table The source table, an array of objects.
 * @param dimension A dimension to slice the source table by.
 * @returns A set of tables, filtered by the dimensions criteria.
 */
function slice(table, dimension) {
    return dimension.map(criteria => table.filter(row => criteria.every(criterion => criterion.predicate(row))));
}
exports.slice = slice;
/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 * @returns Returns a copy of the cube, with the contents of each cell filtered by the predicate.
 */
function filter(cube, predicate) {
    return cube.map(row => row.map(cell => cell.filter(predicate)));
}
exports.filter = filter;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
function map(source, selector) {
    return source.map(row => row.map(selector));
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
