"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slicer = exports.average = exports.sum = exports.map = exports.cube = exports.criteria = void 0;
/**
 * Create a callback to used in a map operation to create the criteria for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this criteria on.
 */
const criteria = (key) => (value) => (record) => record[key] === value;
exports.criteria = criteria;
/**
 * Pivots a table by two axes returning a cube.
 * @param records The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 */
const cube = (records, y, x) => (0, exports.slicer)(y)(records).map((0, exports.slicer)(x));
exports.cube = cube;
/**
 * Queries data from a cube.
 * @param cube The source data, a matrix of records.
 * @param query A callback function to create a result from each cell of the cube.
 */
const map = (cube, query) => cube.map((matrix) => matrix.map(query));
exports.map = map;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
const sum = (selector) => (records) => records.reduce((total, source) => total + selector(source), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
const average = (selector) => (records) => (0, exports.sum)(selector)(records) / records.length;
exports.average = average;
/**
 * A generator that creates a function to slice source data by the criteria in a dimension
 * @param dimension The dimension used to slice the source data
 * @hidden
 */
const slicer = (dimension) => (records) => dimension.map(Array.prototype.filter, records);
exports.slicer = slicer;
