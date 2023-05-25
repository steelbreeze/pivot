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
exports.pivot = pivotImplementation; // NOTE: this applies a public interface called pivot over the pivotImplementation function with varying return types depending on the number of dimensions passed.
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @typeParam TValue The type of the source data.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (cube, query) => {
    var result = [];
    for (var matrix of cube) {
        var interim = [];
        for (var array of matrix) {
            interim.push(query(array));
        }
        result.push(interim);
    }
    return result;
};
exports.map = map;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
const sum = (selector) => (source) => {
    var result = 0;
    for (var value of source) {
        result += selector(value);
    }
    return result;
};
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
// private implementation of the pivot function; required for the recursive call which does not use the public interface.
function pivotImplementation(source, first, second, ...others) {
    const matrix = first.map(() => []);
    for (var value of source) {
        for (var di = 0, dl = first.length; di < dl; ++di) {
            if (first[di](value)) {
                matrix[di].push(value);
                break;
            }
        }
    }
    return second ? matrix.map((slice) => pivotImplementation(slice, second, ...others)) : matrix;
}
