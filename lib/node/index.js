"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.select = exports.filter = exports.map = exports.slice = exports.cube = exports.dimension = exports.distinct = void 0;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
const distinct = (table, key, getValue = row => row[key]) => [...new Set(table.map(getValue))];
exports.distinct = distinct;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param criteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
const dimension = (values, key, criteria = value => [Object.assign((row) => row[key] === value, { key, value })]) => values.map(criteria);
exports.dimension = dimension;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
const cube = (table, y, x) => (0, exports.slice)(y)([...table]).map((0, exports.slice)(x));
exports.cube = cube;
/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @param dimension The dimension to generate the slicer for.
 * @returns Returns a function that will take a table and slice it into an array of tables each conforming to the criteria of a point on a dimension.
 */
const slice = (dimension) => table => dimension.map(criteria => {
    let result = [], length = 0;
    for (const row of table) {
        if (criteria.every(criterion => criterion(row))) {
            result.push(row);
        }
        else {
            table[length++] = row;
        }
    }
    table.length = length;
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
const sum = (selector) => table => table.reduce((total, row) => total + selector(row), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
const average = (selector) => table => (0, exports.sum)(selector)(table) / table.length;
exports.average = average;
