"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.count = exports.query = exports.pivot = exports.axis = exports.dimension = void 0;
/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 * @remarks This data structure can be useful in populating lists for filters.
 */
function dimension(table, key, f = row => row[key]) {
    return dimension.make(table.map(f).filter((value, index, source) => source.indexOf(value) === index).sort(), key, f);
}
exports.dimension = dimension;
/**
 * Creates a dimension from an array of values.
 * @param source The source values.
 * @param key The name to give this dimension.
 * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 * @remarks This data structure can be useful in populating lists for filters.
 */
dimension.make = function (source, key, f = row => row[key]) {
    return source.map(value => { return { key, value, filter: row => f(row) === value }; });
};
/**
 * Combines one of more dimensions into an axis, the axis is the cartesean product of all dimension values.
 * @param dimensions The set of dimensions to turn into an axis.
 * @remarks The data structure can be useful in drawing axis in resultant tables.
 */
function axis(...dimensions) {
    return dimensions.reduce((axis, dimension) => axis.flatMap(criteria => dimension.map(criterion => [...criteria, criterion])), [[]]);
}
exports.axis = axis;
/**
 * Slices a table based on the critera specified by a single axis.
 * @param table The source data, an array of JavaScript objects.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice(table, axis) {
    // map the axis criteria into a set of filters
    const filters = axis.map(criteria => criteria.map(criterion => criterion.filter).reduce((a, b) => row => a(row) && b(row)));
    // slice the table based on the filters
    return filters.map(filter => table.filter(filter));
}
/**
 * Pivots a table by any number of axis
 * @param table The source data, an array of JavaScript objects.
 * @param axes The  axis on which to pivot the table.
 */
function pivot(table, ...axes) {
    let res = table;
    let axis = axes.pop();
    if (axis) {
        res = slice(table, axis);
        while (axis = axes.pop()) {
            res = res.map(interim => slice(interim, axis));
        }
    }
    return res;
}
exports.pivot = pivot;
/**
 * Selects data from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result for the table in each cell of the cube.
 */
function query(cube, f) {
    return cube.map(y => y.map(f));
}
exports.query = query;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 * @remarks Null is returned where the table is empty as this represents the absense of values.
 */
function count(table) {
    return table.length || null;
}
exports.count = count;
/**
 * Sums numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
function sum(f) {
    return table => table.length ? table.reduce((total, row) => total + f(row), 0) : null;
}
exports.sum = sum;
/**
 * Averages numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
function average(f) {
    return table => table.length ? sum(f)(table) / count(table) : null;
}
exports.average = average;
