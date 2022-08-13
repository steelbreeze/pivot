import { Callback, Function, Pair } from '@steelbreeze/types';

/** The type of keys supported. */
export type Key = string | number;

/** The type of rows supported. */
export type Row = { [key in Key]: any };

/** The definition of a dimension, the predicate(s) used as criteria used to determine if a row of data belongs to a point on a dimension. */
export type Criteria<TRow extends Row> = Array<Callback<TRow, boolean> & Pair>;

/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export type Dimension<TRow extends Row> = Array<Criteria<TRow>>;

/** A cube of data. */
export type Cube<TValue> = Array<Array<Array<TValue>>>;

/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
export const distinct = <TRow extends Row>(table: Array<TRow>, key: Key, getValue: Callback<TRow, any> = row => row[key]): Array<any> =>
	[...new Set(table.map(getValue))];

/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param criteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export const dimension = <TRow extends Row>(values: Array<any>, key: Key, criteria: Callback<any, Criteria<TRow>> = value => [Object.assign((row: TRow) => row[key] === value, { key, value })]): Dimension<TRow> =>
	values.map(criteria);

/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export const cube = <TRow extends Row>(table: Array<TRow>, y: Dimension<TRow>, x: Dimension<TRow>): Cube<TRow> =>
	slice(y)([...table]).map(slice(x));

/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @param dimension The dimension to generate the slicer for.
 * @returns Returns a function that will take a table and slice it into an array of tables each conforming to the criteria of a point on a dimension.
 */
export const slice = <TRow extends Row>(dimension: Dimension<TRow>): Function<Array<TRow>, Array<Array<TRow>>> =>
	table => dimension.map(criteria => {
		let result: Array<TRow> = [], length = 0;

		for (const row of table) {
			if (criteria.every(criterion => criterion(row))) {
				result.push(row);
			} else {
				table[length++] = row;
			}
		}

		table.length = length;

		return result;
	});

/**
 * Queries data from a cube, or any matrix structure.
 * @param cube The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export const map = <TRow, TResult>(cube: Cube<TRow>, selector: Callback<Array<TRow>, TResult>): Array<Array<TResult>> =>
	cube.map(row => row.map(selector));

/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
export const filter = <TRow extends Row>(predicate: Callback<TRow, boolean>): Callback<Array<TRow>, Array<TRow>> =>
	table => table.filter(predicate);

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export const select = <TRow, TResult>(selector: Callback<TRow, TResult>): Callback<Array<TRow>, Array<TResult>> =>
	table => table.map(selector);

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export const sum = <TRow extends Row>(selector: Callback<TRow, number>): Callback<Array<TRow>, number> =>
	table => table.reduce((total, row) => total + selector(row), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export const average = <TRow extends Row>(selector: Callback<TRow, number>): Callback<Array<TRow>, number> =>
	table => sum(selector)(table) / table.length;
