import { Callback, Pair, Predicate } from '@steelbreeze/types';

/** The type of values that can be in a row. */
export type Value = any;

/** The type of keys supported. */
export type Key = Exclude<keyof Value, Symbol>;

/** The type of rows supported. */
export type Row = { [key in Key]: Value };

/** A set of predicates and associated metadata used to determine if a row of data is associated with a point of a dimension. */
export type Criteria<TRow> = Predicate<TRow> & { metadata: Array<Pair<Value, Key>> };

/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export type Dimension<TRow> = Array<Criteria<TRow>>;

/** A matrix is a two-dimensional data structure. */
export type Matrix<TSource> = Array<Array<TSource>>;

/** A cube of data. */
export type Cube<TSource> = Matrix<Array<TSource>>;

/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param createCriteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export const dimension = <TRow extends Row>(values: Array<Value>, key: Key, createCriteria: Callback<Value, Criteria<TRow>> = (value: Value) => Object.assign((row: TRow) => row[key] === value, { metadata: [{ key, value }] })): Dimension<TRow> =>
	values.map(createCriteria);

/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export const cube = <TRow>(table: Array<TRow>, y: Dimension<TRow>, x: Dimension<TRow>): Cube<TRow> =>
	y.map(yCriteria => table.filter(yCriteria)).map(slice => x.map(xCriteria => slice.filter(xCriteria)));

/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export const map = <TSource, TResult>(source: Matrix<TSource>, selector: Callback<TSource, TResult>): Matrix<TResult> =>
	source.map((slice: Array<TSource>) => slice.map(selector));

/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
export const filter = <TRow>(predicate: Callback<TRow, boolean>): Callback<Array<TRow>, Array<TRow>> =>
	(table: Array<TRow>) => table.filter(predicate);

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export const select = <TRow, TResult>(selector: Callback<TRow, TResult>): Callback<Array<TRow>, Array<TResult>> =>
	(table: Array<TRow>) => table.map(selector);

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export const sum = <TRow>(selector: Callback<TRow, number>): Callback<Array<TRow>, number> =>
	(table: Array<TRow>) => table.reduce((total: number, row: TRow) => total + selector(row), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export const average = <TRow>(selector: Callback<TRow, number>): Callback<Array<TRow>, number> =>
	(table: Array<TRow>) => sum(selector)(table) / table.length;