"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.select = exports.filter = exports.map = exports.cube = exports.criteria = void 0;
/** Create a callback to used in a map operation to create the criteria for each point on a dimension.
 * @param key The property in the source data to base this criteria on.
 */
const criteria = (key) => value => record => record[key] === value;
exports.criteria = criteria;
/**
 * Pivots a table by two axes returning a cube.
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 */
const cube = (source, y, x) => split([...source], y).map(slice => split(slice, x));
exports.cube = cube;
/**
 * Queries data from a cube.
 * @param source The source data, a matrix of records.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (source, query) => source.map(slice => slice.map(query));
exports.map = map;
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test source data to see if it should be included in the filter results.
 */
const filter = (predicate) => source => source.filter(predicate);
exports.filter = filter;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
const select = (selector) => source => source.map(selector);
exports.select = select;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
const sum = (selector) => source => source.reduce((total, source) => total + selector(source), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
const average = (selector) => source => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
/**
 * Creates a callback used within a map operation to slice & dice source data by a dimension.
 * @hidden
 */
const split = (records, dimension) => dimension.map(criteria => {
    let length = 0, result = records.filter(record => criteria(record) || !(records[length++] = record));
    records.length = length;
    return result;
});
