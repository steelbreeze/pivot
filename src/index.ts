import { Callback, Function, Predicate } from '@steelbreeze/types';

/** The type of values that can be in the source data. */
export type Value = any;

/** The type of keys supported. */
export type Key = string | number;

/** A predicate used to determine if source data is associated with a point of a dimension and its associated metadata (used for labelling purposes). */
export type Criteria<TRecord> = Predicate<TRecord> & { metadata?: any };

/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export type Dimension<TRecord> = Array<Criteria<TRecord>>;

/** A matrix is a two-dimensional data structure. */
export type Matrix<TRecord> = Array<Array<TRecord>>;

/** A cube of data. */
export type Cube<TRecord> = Matrix<Array<TRecord>>;

/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param callback An optional callback to build the dimensions criteria for each of the values provided.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export const dimension = <TRecord extends Record<Key, Value>>(key: Key, values: Array<Value>, callback: Callback<Value, Criteria<TRecord>> = value => record => record[key] === value): Dimension<TRecord> =>
	values.map(callback);

/**
 * Pivots a table by two axes
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export const cube = <TRecord>(source: Array<TRecord>, y: Dimension<TRecord>, x: Dimension<TRecord>): Cube<TRecord> =>
	slicer([...source], y).map(slice => slicer(slice, x));

/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data, a matrix of records.
 * @param callback A callback function to create a result from each cell of the cube.
 */
export const map = <TRecord, TResult>(source: Matrix<TRecord>, callback: Callback<TRecord, TResult>): Matrix<TResult> =>
	source.map(slice => slice.map(callback));

/**
 * A generator, used to filter data within a cube.
 * @param callback A predicate to test source data to see if it should be included in the filter results.
 */
export const filter = <TRecord>(callback: Callback<TRecord, boolean>): Function<Array<TRecord>, Array<TRecord>> =>
	source => source.filter(callback);

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param callback A function to transform a source record into the desired result.
 */
export const select = <TRecord, TResult>(callback: Callback<TRecord, TResult>): Function<Array<TRecord>, Array<TResult>> =>
	source => source.map(callback);

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export const sum = <TRecord>(callback: Function<TRecord, number>): Function<Array<TRecord>, number> =>
	source => source.reduce((total, source) => total + callback(source), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export const average = <TRecord>(callback: Function<TRecord, number>): Function<Array<TRecord>, number> =>
	source => sum(callback)(source) / source.length;

/**
 * Creates a callback used within a map operation to slice & dice source data by a dimension.
 * Acts just as Array.prototype.filter, but the returned results are removed from the source array meaning less items will be evaluated for the next iteration through a dimensions criteria.
 * @hidden 
 */
const slicer = <TRecord>(source: Array<TRecord>, dimension: Dimension<TRecord>): Matrix<TRecord> =>
	dimension.map((criteria: Criteria<TRecord>) => {
		let length = 0, result = source.filter(record => criteria(record) || !(source[length++] = record));

		source.length = length;

		return result;
	});