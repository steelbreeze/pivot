"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compact = exports.average = exports.sum = exports.count = exports.query = exports.pivot = exports.axis = exports.dimension = void 0;
/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 * @param s An optional callback function used to sort the values of the dimension, conforming to Array.prototype.sort.
 */
function dimension(table, key, f = (row) => row[key], s) {
    return dimension.make(table.map(f).filter((value, index, source) => source.indexOf(value) === index).sort(s), key, f);
}
exports.dimension = dimension;
/**
 * Creates a dimension from an array of values.
 * @param source The source values.
 * @param key The name to give this dimension.
 * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
dimension.make = function (source, key, f = (row) => row[key]) {
    return source.map(value => { return { key, value, f: row => f(row) === value }; });
};
/**
 * Combines one of more dimensions into an axis, the axis is the cartesian product of all dimension values.
 * @param dimensions The set of dimensions to turn into an axis.
 */
function axis(...dimensions) {
    return dimensions.reduce((axis, dimension) => axis.flatMap(criteria => dimension.map(criterion => [...criteria, criterion])), [[]]); // NOTE: this is just a generic cartesian product algorithm
}
exports.axis = axis;
/**
 * Slices a table based on the critera specified by a single axis.
 * @param table The source data, an array of JavaScript objects.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice(table, axis) {
    return axis.map(criteria => table.filter(criteria.map(criterion => criterion.f).reduce((a, b) => row => a(row) && b(row))));
}
/**
 * Pivots a table by 1..n axis
 * @param table The source data, an array of JavaScript objects.
 * @param axes 1..n Axis to pivot the table by.
 */
function pivot(table, ...axes) {
    return axes.reduce((res, axis) => res.map(interim => slice(interim, axis)), slice(table, axes.shift()));
}
exports.pivot = pivot;
/**
 * Returns data queried from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result from each cell of the cube.
 */
function query(cube, f) {
    return cube.map(y => y.map(f));
}
exports.query = query;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
function count(table) {
    return table.length || null;
}
exports.count = count;
/**
 *  generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param f A callback function to derive a numerical value for each row.
 */
function sum(f) {
    return table => table.length ? table.reduce((total, row) => total + f(row), 0) : null;
}
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param f A callback function to derive a numerical value for each row.
 */
function average(f) {
    return table => table.length ? sum(f)(table) / count(table) : null;
}
exports.average = average;
/**
 * Compacts a cube and its axes by removing any rows without resultant values. Note that this also removes entries from the axes as well such that they still align to the cube.
 * @param cube The source cube.
 * @param y The y axis that the cube was origionally pivoted by.
 * @remarks This currently only compacts on the y dimension, x dimension and potentially multi dimensional coming soon...
 */
function compact(cube, y) {
    // filter out empty rows from the cube and y axis
    for (let i = y.length; --i;) { // NOTE: have to perform a reverse loop to preserve indexs as we iterate 
        if (!cube[i].some(table => table.length)) {
            cube.splice(i, 1);
            y.splice(i, 1);
        }
    }
}
exports.compact = compact;
