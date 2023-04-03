"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.map = exports.pivot = exports.criteria = exports.distinct = void 0;
/** Function to pass into Array.prototype.filter to return unique values */
const distinct = (value, index, source) => source.indexOf(value) === index;
exports.distinct = distinct;
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this predicate on.
 */
const criteria = (key) => (criterion) => (value) => value[key] === criterion;
exports.criteria = criteria;
// internal implemntation of the pivot function. Note, this needs to be seperate from the external API as the recursion within does not use the external API.
const pivotImplementation = (source, first, second, ...others) => first.map(predicate => {
    let length = 0;
    let slice = source.filter(record => predicate(record) || !(source[length++] = record));
    source.length = length;
    return second ? pivotImplementation(slice, second, ...others) : slice;
});
/**
 * Pivots source data by one or more dimensions returning an n-cube.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param second The second dimension used to pivot the source data.
 * @param third The third dimension used to pivot the source data.
 * @param others Additional dimensions to pivot the source data by.
 * @returns Returns an n-cube, the type of which depends on how many dimensions are passed in: Matrix<TSource> for one dimension; Cube<TSource> for two dimension; Cube<Array<TSource> for three dimensions, etc..
 */
const pivot = (source, first, second, ...others) => pivotImplementation([...source], first, second, ...others);
exports.pivot = pivot;
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (cube, query) => cube.map((matrix) => matrix.map(query));
exports.map = map;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
const sum = (selector) => (source) => source.reduce((total, source) => total + selector(source), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
const average = (selector) => (source) => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
