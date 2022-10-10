"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.select = exports.filter = exports.map = exports.cube = exports.dimension = void 0;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param criteria An optional callback to build the dimensions criteria for each of the values provided.
 * @returns Returns a simple dimension with a single criterion for each key/value combination and associated metadata.
 */
const dimension = (key, values, criteria = (value) => (record) => record[key] === value) => values.map(criteria);
exports.dimension = dimension;
/**
 * Pivots a table by two axes
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
const cube = (source, y, x) => slicer([...source], y).map(slice => slicer(slice, x));
exports.cube = cube;
/**
 * Queries data from a cube.
 * @param source The source data, a matrix of records.
 * @param mapper A callback function to create a result from each cell of the cube.
 */
const map = (source, mapper) => source.map(slice => slice.map(mapper));
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
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
const average = (selector) => source => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
/**
 * Creates a callback used within a map operation to slice & dice source data by a dimension.
 * Acts just as Array.prototype.filter, but the returned results are removed from the source array meaning less items will be evaluated for the next iteration through a dimensions criteria.
 * @hidden
 */
const slicer = (records, dimension) => dimension.map((criteria) => {
    let length = 0, result = records.filter((record) => criteria(record) || !(records[length++] = record));
    records.length = length;
    return result;
});
