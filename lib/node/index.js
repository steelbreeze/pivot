"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.map = exports.pivot = exports.criteria = void 0;
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @typeParam TValue The type of the source data that will be evaluated by this criteria.
 * @param key The property in the source data to base this predicate on.
 * @category Core API
 */
const criteria = (key) => (criterion) => (value) => value[key] === criterion;
exports.criteria = criteria;
// the implementation of pivot
function pivot(source, ...[dimension, ...dimensions]) {
    // create a result matrix sized to the first dimension
    const matrix = dimension.map(() => []);
    // slice source data into the result matrix according to the criteria of the first dimension
    for (var value of source) {
        for (var di = 0, dl = dimension.length; di < dl; ++di) {
            if (dimension[di](value)) {
                matrix[di].push(value);
                break;
            }
        }
    }
    // recurse if there are other dimensions, otherwise just return the matrix
    return dimensions.length ? matrix.map(slice => pivot(slice, ...dimensions)) : matrix;
}
exports.pivot = pivot;
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @typeParam TValue The type of the data within the cube.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 * @category Cube query helpers
 */
const map = (cube, query) => cube.map(matrix => matrix.map(query));
exports.map = map;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
const sum = (selector) => (source) => source.reduce((a, b) => a + selector(b), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
const average = (selector) => (source) => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
