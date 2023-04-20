"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = exports.average = exports.sum = exports.map = exports.pivot = exports.criteria = void 0;
// slice the source data into partitions, one for each criteria of the dimension
function slice(source, dimension) {
    const result = Array.from(dimension, () => []);
    for (let si = 0; si < source.length; ++si) {
        const value = source[si];
        for (let di = 0; di < dimension.length; ++di) {
            if (dimension[di](value)) {
                result[di].push(value);
                break;
            }
        }
    }
    return result;
}
// slicd and dice the source data based on the number of dimensions passed
const dice = (source, first, second, ...others) => second ? slice(source, first).map(p => dice(p, second, ...others)) : slice(source, first);
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @typeParam TValue The type of the source data.
 * @param key The property in the source data to base this predicate on.
 */
const criteria = (key) => (criterion) => (value) => value[key] === criterion;
exports.criteria = criteria;
/**
 * Pivots source data by one or more dimensions returning an n-cube.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param second The second dimension used to pivot the source data.
 * @param third The third dimension used to pivot the source data.
 * @param others Additional dimensions to pivot the source data by.
 * @returns Returns an n-cube, the type of which depends on how many dimensions are passed in: Matrix<TValue> for one dimension; Cube<TValue> for two dimension; Cube<Array<TValue> for three dimensions, etc..
 */
const pivot = (source, first, second, ...others) => dice([...source], first, second, ...others);
exports.pivot = pivot;
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @typeParam TValue The type of the source data.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (cube, query) => cube.map((matrix) => matrix.map(query));
exports.map = map;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
const sum = (selector) => (source) => source.reduce((total, source) => total + selector(source), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
const average = (selector) => (source) => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
/** Function to pass into Array.prototype.filter to return unique values */
const distinct = (value, index, source) => source.indexOf(value) === index;
exports.distinct = distinct;
