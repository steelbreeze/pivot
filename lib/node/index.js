"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.average = exports.sum = exports.select = exports.map = exports.filter = exports.cube = exports.join = exports.expand = exports.dimension = exports.distinct = void 0;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
const distinct = (table, key, getValue = row => row[key]) => table.map(getValue).filter((value, index, source) => source.indexOf(value) === index);
exports.distinct = distinct;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
const dimension = (values, key, getValue = row => row[key]) => values.map(value => [{ key, value, predicate: row => getValue(row) === value }]);
exports.dimension = dimension;
/**
 * Derives additional criteria in a dimension based on existing.
 * For example, this enables hierarchies to be displayed on axes.
 * @param dimension The source dimension.
 * @param getCriterion A callback function to derive the new criterion from an existing criterion.
 * @returns Returns the new expanded dimension
 */
const expand = (dimension, getCriterion) => dimension.map(criteria => [getCriterion(criteria[0]), ...criteria]);
exports.expand = expand;
/**
 * Create a composite dimension from others. This creates a cartesian product of the source dimensions criteria.
 * @param dimensions An array of dimensions to combine into one.
 * @returns Returns a complex dimension with criteria being the cartesian product of the source dimensions.
 */
const join = (...dimensions) => dimensions.reduce((result, dimension) => result.flatMap(c1 => dimension.map(c2 => [...c1, ...c2])));
exports.join = join;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
const cube = (table, axes) => slice(axes.y)(table).map(slice(axes.x));
exports.cube = cube;
/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @hidden
 */
const slice = (dimension) => table => dimension.map(criteria => table.filter(row => criteria.every(criterion => criterion.predicate(row))));
/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 * @returns Returns a copy of the cube, with the contents of each cell filtered by the predicate.
 */
const filter = (cube, predicate) => cube.map(row => row.map(cell => cell.filter(predicate)));
exports.filter = filter;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
const map = (source, selector) => source.map(row => row.map(selector));
exports.map = map;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
const select = (selector) => table => table.map(selector);
exports.select = select;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
const sum = (selector) => table => table ? table.reduce((total, row) => total + selector(row), 0) : null;
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
const average = (selector) => table => table ? exports.sum(selector)(table) / exports.count(table) : null;
exports.average = average;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
const count = (table) => table.length || null;
exports.count = count;
