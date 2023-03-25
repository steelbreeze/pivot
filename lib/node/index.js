"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.map = exports.cube = exports.criteria = void 0;
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this predicate on.
 */
const criteria = (key) => (value) => (obj) => obj[key] === value;
exports.criteria = criteria;
/**
 * Pivots source data by one or more dimensions returning an n-cube.
 * @param source The source data, an array of objects.
 * @param first The first dimension to pivot the source data by.
 * @param other The other dimensions to use to pivot the source data by.
 * @returns Returns an n-cube; minimally a Matrix if only one dimension passed, a Cube if two dimensions passed, and so one as more dimensions added.
 */
const cube = (source, first, ...other) => {
    const [next, ...tail] = other;
    return first.map(predicate => next ? (0, exports.cube)(source.filter(predicate), next, ...tail) : source.filter(predicate));
};
exports.cube = cube;
/**
 * Queries data from a cube.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (cube, query) => cube.map((matrix) => matrix.map(query));
exports.map = map;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
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
