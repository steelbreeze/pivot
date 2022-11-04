import { Callback, Function, Predicate } from '@steelbreeze/types';

/** A dimension is a series of predicates used to partition data. */
export type Dimension<TRecord> = Array<Predicate<TRecord>>;

/** A cube is a three dimensional data structure. */
export type Cube<TRecord> = Array<Array<Array<TRecord>>>;

/**
 * Create a callback to used in a map operation to create the criteria for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this criteria on.
 */
export const criteria = <TRecord>(key: keyof TRecord): Function<TRecord[keyof TRecord], Predicate<TRecord>> =>
	value => record => record[key] === value;

/**
 * Pivots a table by two axes returning a cube.
 * @param records The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 */
export const cube = <TRecord>(records: Array<TRecord>, y: Dimension<TRecord>, x: Dimension<TRecord>): Cube<TRecord> =>
	y.map(Array.prototype.filter, records).map(matrix => x.map(Array.prototype.filter, matrix));

/**
 * Queries data from a cube.
 * @param cube The source data, a matrix of records.
 * @param query A callback function to create a result from each cell of the cube.
 */
export const map = <TRecord, TResult>(cube: Cube<TRecord>, query: Callback<Array<TRecord>, TResult>): Array<Array<TResult>> =>
	cube.map(matrix => matrix.map(query));

/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test source data to see if it should be included in the filter results.
 */
export const filter = <TRecord>(predicate: Predicate<TRecord>): Function<Array<TRecord>, Array<TRecord>> =>
	records => records.filter(predicate);

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export const select = <TRecord, TResult>(selector: Callback<TRecord, TResult>): Function<Array<TRecord>, Array<TResult>> =>
	records => records.map(selector);

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export const sum = <TRecord>(selector: Function<TRecord, number>): Function<Array<TRecord>, number> =>
	records => records.reduce((total, source) => total + selector(source), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export const average = <TRecord>(selector: Function<TRecord, number>): Function<Array<TRecord>, number> =>
	records => sum(selector)(records) / records.length;