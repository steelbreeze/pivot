"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.count = exports.query = exports.compact = exports.pivot = exports.axis = void 0;
var axis;
(function (axis) {
    /**
     * Creates an axis based on the contents of a table.
     * @param table The source table, an array of objects.
     * @param key The name to give this axis.
     * @param f An optional callback function to derive values from the source table objects. If omitted, the object attribute with the same name as the key is derived.
     * @param s An optional callback function used to sort the values of the dimension. This conforms to the sort criteria used by Array.prototype.sort.
     */
    function fromTable(table, key, f = (row) => row[key], s) {
        return fromValues(table.map(f).filter((value, index, source) => source.indexOf(value) === index).sort(s), key, f);
    }
    axis.fromTable = fromTable;
    /**
     * Creates an axis from an array of values.
     * @param values The source values.
     * @param key The name to give this dimension.
     * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
     */
    function fromValues(values, key, f = (row) => row[key]) {
        return values.map(value => { return { predicate: row => f(row) === value, criteria: [{ key, value }] }; });
    }
    axis.fromValues = fromValues;
    /**
     * Merge two axes together into a single axis.
     * @param axis1 The first axis.
     * @param axis2 The second axis.
     */
    function combine(axis1, axis2) {
        return axis2.reduce((result, s2) => [...result, ...axis1.map(s1 => { return { predicate: (row) => s2.predicate(row) && s1.predicate(row), criteria: [...s2.criteria, ...s1.criteria] }; })], []);
    }
    axis.combine = combine;
})(axis = exports.axis || (exports.axis = {}));
/**
 * Slices a table based on the critera specified by an axis.
 * @param table The source data, an array of rows.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice(table, axis) {
    return axis.map(s => table.filter(s.predicate));
}
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
function pivot(table, y, x) {
    return slice(table, y).map(i => slice(i, x));
}
exports.pivot = pivot;
/**
 * Compacts a cube, removing empty rows or columns on the x any y axes.
 * @param cube The source cube.
 * @param y The first axis the cube was pivoted by.
 * @param x The second axis the cube was pivoted by.
 */
function compact(cube, y, x) {
    const population = query(cube, count);
    for (let i = y.length; i--;) {
        if (!population[i].some(t => t)) {
            y.splice(i, 1);
            cube.splice(i, 1);
        }
    }
    for (let i = x.length; i--;) {
        if (!population.some(r => r[i])) {
            x.splice(i, 1);
            cube.forEach(r => r.splice(i, 1));
        }
    }
}
exports.compact = compact;
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
