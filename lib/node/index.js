"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.query = exports.property = void 0;
exports.pivot = pivot;
/**
 * Creates a predicate function {@link Predicate} for use in the {@link dimension} function to create a {@link Dimension} matching properties.
 * @typeParam TElement The type of the source data that will be evaluated by the generated predicate.
 * @param key The property in the source data to base this {@link Predicate} on.
 * @category Cube building
 */
const property = (key) => value => element => element[key] === value;
exports.property = property;
/**
 * Slices and dices a set of elements based on the criteria defined in one or more dimensions
 * @param elements The elements to pivot
 * @param dimensions The dimensions to slice and dice the data by
 * @returns Returns an Cube, which is an n-dimensional array mirroring the number of dimensions plus the set of elements
 */
function pivot(elements, ...[first, second, ...others]) {
    return (second ? slice(elements, first).map(vector => pivot(vector, second, ...others)) : slice(elements, first));
}
// slices the data by one dimension
const slice = (elements, dimension) => dimension.map(predicate => fastFilter(elements, predicate));
/**
 * Queries data from a {@link Cube} using a selector {@link Func} to transform the elements in each cell into a result.
 * @typeParam TCell The type of the data within the dimensions of the {@link Cube}.
 * @typeParam TResult The type of value returned by the selector.
 * @param cube The {@link Cube} to query data from.
 * @param selector A callback {@link Func} to create a result from each cell of the {@link Cube}.
 * @category Cube query
 */
const query = (cube, selector) => cube.map(slice => slice.map(selector));
exports.query = query;
/**
* Create a callback {@link Func} to pass into {@link query} that sums numerical values derived by the selector {@link Func}.
* @typeParam TElement The type of the data within the cube that will be passed into the selector.
* @param selector A callback {@link Func} to derive a numerical value for each object in the source data.
* @category Cube query
*/
const sum = (selector) => vector => vector.reduce((accumulator, element) => accumulator + selector(element), 0);
exports.sum = sum;
/**
 * Create a callback {@link Func} to pass into {@link query} that averages numerical values derived by the selector {@link Func}.
 * @typeParam TElement The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Func} to derive a numerical value for each object in the source data.
 * @returns Returns the average given the selector; note that for empty cells this will be NaN
 * @category Cube query
 */
const average = (selector) => vector => (0, exports.sum)(selector)(vector) / vector.length;
exports.average = average;
// fast alternative to Array.prototype.filter
function fastFilter(array, predicate) {
    const result = [];
    for (let index = 0; index < array.length; ++index) {
        if (predicate(array[index])) {
            result.push(array[index]);
        }
    }
    return result;
}
