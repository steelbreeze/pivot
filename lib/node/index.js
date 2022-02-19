"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.average = exports.sum = exports.select = exports.filter = exports.map = exports.slice = exports.cube = exports.dimension = exports.distinct = void 0;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
const distinct = (table, key, getValue = row => row[key]) => [...table.reduce((set, row) => set.add(getValue(row)), new Set())];
exports.distinct = distinct;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getCriteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
const dimension = (values, key, getCriteria = value => [{ key, value, predicate: row => row[key] === value }]) => values.map(getCriteria);
exports.dimension = dimension;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
const cube = (table, axes) => (0, exports.slice)(axes.y)([...table]).map((0, exports.slice)(axes.x));
exports.cube = cube;
/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @param dimension The dimension to generate the slicer for.
 * @returns Returns a function that will take a table and slice it into an array of tables each conforming to the criteria of a point on a dimension.
 */
const slice = (dimension) => table => dimension.map(criteria => {
    let result = [], i = 0, j = 0; //, l = table.length;
    for (; i < table.length; ++i) {
        if (criteria.every(criterion => criterion.predicate(table[i]))) {
            result.push(table[i]);
        }
        else {
            table[j++] = table[i];
        }
    }
    table.length = j;
    return result;
});
exports.slice = slice;
/**
 * Queries data from a cube, or any matrix structure.
 * @param cube The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
const map = (cube, selector) => cube.map(row => row.map(selector));
exports.map = map;
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
const filter = (predicate) => table => table.filter(predicate);
exports.filter = filter;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
const select = (selector) => table => table.map(selector);
exports.select = select;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
const sum = (selector) => table => table ? table.reduce((total, row) => total + selector(row), 0) : null;
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
const average = (selector) => table => table ? (0, exports.sum)(selector)(table) / (0, exports.count)(table) : null;
exports.average = average;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
const count = (table) => table.length || null;
exports.count = count;
