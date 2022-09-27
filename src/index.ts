import { Callback, Function, Pair, Predicate } from '@steelbreeze/types';

/** The type of values that can be in the source data. */
export type Value = any;

/** The type of keys supported. */
export type Key = string | number;

/** A predicate used to determine if source data is associated with a point of a dimension and its associated metadata (used for labelling purposes). */
export type Criteria<TSource> = Predicate<TSource> & { metadata: Array<Pair<Key, Value>> };

/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export type Dimension<TSource> = Array<Criteria<TSource>>;

/** A matrix is a two-dimensional data structure. */
export type Matrix<TSource> = Array<Array<TSource>>;

/** A cube of data. */
export type Cube<TSource> = Matrix<Array<TSource>>;

/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param callback An optional callback to build the dimensions criteria for each of the values provided.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export const dimension = <TSource extends Record<Key, Value>>(key: Key, values: Array<Value>, callback: Callback<Value, Criteria<TSource>> = value => Object.assign((source: TSource) => source[key] === value, { metadata: [{ key, value }] })): Dimension<TSource> =>
	values.map(callback);

/**
 * Pivots a table by two axes
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export const cube = <TSource>(source: Array<TSource>, y: Dimension<TSource>, x: Dimension<TSource>): Cube<TSource> =>
	y.map(slicer([...source])).map(slice => x.map(slicer(slice)));

/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param callback A callback function to create a result from each cell of the cube.
 */
export const map = <TSource, TResult>(source: Matrix<TSource>, callback: Callback<TSource, TResult>): Matrix<TResult> =>
	source.map(slice => slice.map(callback));

/**
 * A generator, used to filter data within a cube.
 * @param callback A predicate to test source data to see if it should be included in the filter results.
 */
export const filter = <TSource>(callback: Callback<TSource, boolean>): Function<Array<TSource>, Array<TSource>> =>
	source => source.filter(callback);

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param callback A function to transform a source record into the desired result.
 */
export const select = <TSource, TResult>(callback: Callback<TSource, TResult>): Function<Array<TSource>, Array<TResult>> =>
	source => source.map(callback);

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row of source data.
 */
export const sum = <TSource>(callback: Function<TSource, number>): Function<Array<TSource>, number> =>
	source => source.reduce((total, source) => total + callback(source), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row of source data.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export const average = <TSource>(callback: Function<TSource, number>): Function<Array<TSource>, number> =>
	source => sum(callback)(source) / source.length;

/**
 * Creates a call back used to slice and dice source data by a dimension.
 * @hidden 
 */
const slicer = <TSource>(source: Array<TSource>): Function<Criteria<TSource>, Array<TSource>> => {
	return (criteria: Criteria<TSource>) => {
		let length = 0, result = source.filter(value => criteria(value) || !(source[length++] = value));

		source.length = length;

		return result;
	};
}