"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = exports.average = exports.sum = exports.count = exports.query = exports.cube = exports.slice = exports.axis = void 0;
/** Static class acting as a namespace for axis related functions. */
class axis {
    /**
     * Creates an axis based on the contents of a table.
     * @param table The source table, an array of objects.
     * @param key The name to give this axis.
     * @param mapper An optional callback function to derive the axis values from the source table row. If omitted, the object attribute with the same name as the key is derived.
     * @param sorter An optional callback function used to sort the values of the dimension. This conforms to the sort criteria used by Array.prototype.sort.
     */
    static fromTable(table, key, mapper = (row) => row[key], sorter) {
        return axis.fromValues(table.map(mapper).filter((value, index, source) => source.indexOf(value) === index).sort(sorter), key, mapper);
    }
    /**
     * Creates an axis from an array of values.
     * @param values The source values.
     * @param key The name to give this dimension.
     * @param mapper An optional callback function used to convert values in the source table to those in the dimension when pivoting.
     */
    static fromValues(values, key, mapper = (row) => row[key]) {
        return values.map(value => { return { p: row => mapper(row) === value, criteria: [{ key, value }] }; });
    }
    /**
     * Merge two axes together into a single axis.
     * @param axis1 The first axis.
     * @param axis2 The second axis.
     */
    static join(axis1, axis2) {
        return axis1.reduce((result, s1) => [...result, ...axis2.map(s2 => { return { p: (row) => s1.p(row) && s2.p(row), criteria: [...s1.criteria, ...s2.criteria] }; })], []);
    }
}
exports.axis = axis;
/**
 * Slices a table based on the critera specified by an axis.
 * @param table The source data, an array of rows.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice(table, axis) {
    return axis.map(s => table.filter(s.p));
}
exports.slice = slice;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
function cube(table, y, x) {
    return slice(table, y).map(i => slice(i, x));
}
exports.cube = cube;
/**
 * Returns data queried from a cube as a table.
 * @param cube The source cube.
 * @param mapper A callback function to create a result from each cell of the cube.
 * @param filter A predicate to filter the cube by.
 */
function query(cube, mapper, filter) {
    return cube.map(y => y.map(x => mapper(filter ? x.filter(filter) : x)));
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
 * @param mapper A callback function to derive a numerical value for each row.
 */
function sum(mapper) {
    return table => table.length ? table.reduce((total, row) => total + mapper(row), 0) : null;
}
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param mapper A callback function to derive a numerical value for each row.
 */
function average(mapper) {
    return table => table.length ? sum(mapper)(table) / count(table) : null;
}
exports.average = average;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param mapper A function to transform a source record into the desired result.
 */
function select(mapper) {
    return table => table.map(mapper);
}
exports.select = select;
