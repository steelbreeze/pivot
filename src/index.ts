import { Callback, Function, Predicate } from '@steelbreeze/types';

/** A predicate used to determine if source data is associated with a point of a dimension and its optional associated metadata. */
export type Criteria<TRecord> = Predicate<TRecord> & Record<keyof any, any>;

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
 * @param criteria An optional callback to build the dimensions criteria for each of the values provided.
 * @returns Returns a simple dimension with a single criterion for each key/value combination and associated metadata.
 */
export const dimension = <TRecord>(key: keyof TRecord, values: Array<any>, criteria: Callback<any, Criteria<TRecord>> = (value: any) => (record: TRecord) => record[key] === value): Dimension<TRecord> =>
	values.map(criteria);

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
	source => source.reduce((total: number, source: TRecord) => total + selector(source), 0);

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
const slicer = <TRecord>(records: Array<TRecord>, dimension: Dimension<TRecord>): Matrix<TRecord> =>
	dimension.map((criteria: Criteria<TRecord>) => {
		let length = 0, result = records.filter((record: TRecord) => criteria(record) || !(records[length++] = record));

		records.length = length;

		return result;
	});