"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.select = exports.filter = exports.map = exports.cube = exports.dimension = void 0;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param createCriteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
const dimension = (values, key, createCriteria = (value) => Object.assign((row) => row[key] === value, { metadata: [{ key, value }] })) => values.map(createCriteria);
exports.dimension = dimension;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
const cube = (table, y, x) => y.map((yCriteria) => table.filter(yCriteria)).map((slice) => x.map((xCriteria) => slice.filter(xCriteria)));
exports.cube = cube;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
const map = (source, selector) => source.map((slice) => slice.map(selector));
exports.map = map;
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
const filter = (predicate) => (table) => table.filter(predicate);
exports.filter = filter;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
const select = (selector) => (table) => table.map(selector);
exports.select = select;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
const sum = (selector) => (table) => table.reduce((total, row) => total + selector(row), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
const average = (selector) => (table) => (0, exports.sum)(selector)(table) / table.length;
exports.average = average;
