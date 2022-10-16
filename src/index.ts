import { Callback, Function, Predicate } from '@steelbreeze/types';

/** A matrix is a two-dimensional data structure. */
export type Matrix<TRecord> = Array<Array<TRecord>>;

/** A cube is a three dimensional data structure. */
export type Cube<TRecord> = Matrix<Array<TRecord>>;

/** Create a callback to used in a map operation to create the criteria for each point on a dimension.
 * @param key The property in the source data to base this criteria on.
 * @remarks Use a bespoke version of this function if custom criteria that includes metadata is required.
 */
export const criteria = <TRecord>(key: keyof TRecord): Callback<TRecord[keyof TRecord], Predicate<TRecord>> =>
	value => record => record[key] === value;

/**
 * Pivots a table by two axes
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export const cube = <TRecord>(source: Array<TRecord>, y: Array<Predicate<TRecord>>, x: Array<Predicate<TRecord>>): Cube<TRecord> =>
	split([...source], y).map(slice => split(slice, x));

/**
 * Queries data from a cube.
 * @param source The source data, a matrix of records.
 * @param mapper A callback function to create a result from each cell of the cube.
 */
export const map = <TRecord, TResult>(source: Matrix<TRecord>, mapper: Callback<TRecord, TResult>): Matrix<TResult> =>
	source.map(slice => slice.map(mapper));

/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test source data to see if it should be included in the filter results.
 */
export const filter = <TRecord>(predicate: Predicate<TRecord>): Function<Array<TRecord>, Array<TRecord>> =>
	source => source.filter(predicate);

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export const select = <TRecord, TResult>(selector: Callback<TRecord, TResult>): Function<Array<TRecord>, Array<TResult>> =>
	source => source.map(selector);

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export const sum = <TRecord>(selector: Function<TRecord, number>): Function<Array<TRecord>, number> =>
	source => source.reduce((total, source) => total + selector(source), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export const average = <TRecord>(selector: Function<TRecord, number>): Function<Array<TRecord>, number> =>
	source => sum(selector)(source) / source.length;

/**
 * Creates a callback used within a map operation to slice & dice source data by a dimension.
 * Acts just as Array.prototype.filter, but the returned results are removed from the source array meaning less items will be evaluated for the next iteration through a dimensions criteria.
 * @hidden 
 */
const split = <TRecord>(records: Array<TRecord>, dimension: Array<Predicate<TRecord>>): Matrix<TRecord> =>
	dimension.map(criteria => {
		let length = 0, result = records.filter(record => criteria(record) || !(records[length++] = record));

		records.length = length;

		return result;
	});