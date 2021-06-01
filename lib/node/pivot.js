"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.count = exports.query = exports.pivot = exports.axis = exports.dimension = void 0;
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
 * @param y The first axis to pivot the table by.
 * @param axes 0..n subsiquent axes to pivot the table by.
 */
function pivot(table, y, x) {
    const initial = slice(table, y);
    const presence = initial.map(table => table.length);
    for (let i = presence.length; i--;) {
        if (!presence[i]) {
            y.splice(i, 1);
            initial.splice(i, 1);
        }
    }
    const result = initial.map(interim => slice(interim, x));
    return result;
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
