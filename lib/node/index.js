"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.select = exports.filter = exports.map = exports.cube = exports.dimension = void 0;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param callback An optional callback to build the dimensions criteria for each of the values provided.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
const dimension = (key, values, callback = value => Object.assign((source) => source[key] === value, { metadata: [{ key, value }] })) => values.map(callback);
exports.dimension = dimension;
/**
 * Pivots a table by two axes
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
const cube = (source, y, x) => y.map(slice([...source])).map(table => x.map(slice(table)));
exports.cube = cube;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param callback A callback function to create a result from each cell of the cube.
 */
const map = (source, callback) => source.map(slice => slice.map(callback));
exports.map = map;
/**
 * A generator, used to filter data within a cube.
 * @param callback A predicate to test source data to see if it should be included in the filter results.
 */
const filter = (callback) => source => source.filter(callback);
exports.filter = filter;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param callback A function to transform a source record into the desired result.
 */
const select = (callback) => source => source.map(callback);
exports.select = select;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row of source data.
 */
const sum = (callback) => source => source.reduce((total, source) => total + callback(source), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row of source data.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
const average = (callback) => source => (0, exports.sum)(callback)(source) / source.length;
exports.average = average;
/**
 * Creates a call back used to slice and dice source data by a dimension.
 * @hidden
 */
const slice = (source) => {
    return (criteria) => {
        let length = 0, result = source.filter(value => criteria(value) || !(source[length++] = value));
        source.length = length;
        return result;
    };
};
