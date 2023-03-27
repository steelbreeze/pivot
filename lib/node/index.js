"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.map = exports.pivot = exports.criteria = exports.distinct = void 0;
/** Function to pass into Array.prototype.filter to return unique values */
function distinct(value, index, source) {
    return source.indexOf(value) === index;
}
exports.distinct = distinct;
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this predicate on.
 */
function criteria(key) {
    return (criterion) => (value) => value[key] === criterion;
}
exports.criteria = criteria;
function pivot() {
}
exports.pivot = pivot;
// implemntation of the single pivot function satisfying all three of the function prototypes above
//export function pivot<TSource>(source: Array<TSource>, first: Dimension<TSource>, second?: Dimension<TSource>, ...others: Array<Dimension<TSource>>) {
//	return first.map(predicate => second ? pivot(source.filter(predicate), second, ...others) : source.filter(predicate));
//}
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
function map(cube, query) {
    return cube.map((matrix) => matrix.map(query));
}
exports.map = map;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
function sum(selector) {
    return (source) => source.reduce((total, source) => total + selector(source), 0);
}
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
function average(selector) {
    return (source) => sum(selector)(source) / source.length;
}
exports.average = average;
