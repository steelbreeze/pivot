"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = exports.average = exports.sum = exports.map = exports.pivot = exports.criteria = void 0;
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @typeParam TValue The type of the source data.
 * @param key The property in the source data to base this predicate on.
 */
const criteria = (key) => (criterion) => (value) => value[key] === criterion;
exports.criteria = criteria;
function pivot(source, ...[first, ...others]) {
    // create a result matrix sized to the first dimension
    const matrix = first.map(() => []);
    // partition source data into the matrix according to the criteria of the first dimension
    for (var value of source) {
        for (var di = 0, dl = first.length; di < dl; ++di) {
            if (first[di](value)) {
                matrix[di].push(value);
                break;
            }
        }
    }
    // recurse if there are other dimensions, otherwise just return the matrix
    return others.length ? matrix.map(slice => pivot(slice, ...others)) : matrix;
}
exports.pivot = pivot;
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @typeParam TValue The type of the source data.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (cube, query) => cube.map(matrix => matrix.map(query));
exports.map = map;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
const sum = (selector) => (source) => source.reduce((a, b) => a + selector(b), 0);
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
