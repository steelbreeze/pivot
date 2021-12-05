/** A function taking one argument and returning a result. */
export type Function<TArg, TResult> = (arg: TArg) => TResult;

/** A function taking one argument and returning a boolean result. */
export type Predicate<TArg> = Function<TArg, boolean>;

/** A two-dimensional array of values. */
export type Matrix<TValue> = Array<Array<TValue>>;

/** The type of object keys supported. */
export type Key = Exclude<keyof any, symbol>;

/** A key/value pair. */
export interface Pair {
	/** The key. */
	key: Key;

	/** The value. */
	value: any;
}

/** A base type for tables supported. */
export type Row = { [key in Key]: any };

/** A criterion used in the criteria of a dimension. */
export interface Criterion<TRow> extends Pair {
	/** The predicate used to perform the test. */
	predicate: Predicate<TRow>;
}

/** The set of criterion used to select items for a row or column within a cube. */
export type Criteria<TRow> = Array<Criterion<TRow>>;

/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export type Dimension<TRow> = Array<Criteria<TRow>>;

/** A pair of axes to be used in a pivot operation. */
export interface Axes<TRow> {
	/** The x axis; columns in the resultant pivot table. */
	x: Dimension<TRow>;

	/** The y axis; rows in the resultant pivot table. */
	y: Dimension<TRow>;
}

/** A table of data. */
export type Table<TRow> = Array<TRow>;

/** A cube of data. */
export type Cube<TRow> = Matrix<Table<TRow>>;

/**
 * Function to pass into Array.prototype.filter to return only unique values.
 */
export const unique = <TValue>(value: TValue, index: number, array: Array<TValue>): boolean =>
	array.indexOf(value) === index;

/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
export const distinct = <TRow extends Row>(table: Table<TRow>, key: Key, getValue: Function<TRow, any> = row => row[key]): Array<any> =>
	table.map(getValue).filter(unique);

/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getCriteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export const dimension = <TRow extends Row>(values: Array<any>, key: Key, getCriteria: Function<any, Criteria<TRow>> = value => [{ key, value, predicate: row => row[key] === value }]): Dimension<TRow> =>
	values.map(getCriteria);

/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export const cube = <TRow>(table: Table<TRow>, axes: Axes<TRow>): Cube<TRow> =>
	slice(axes.y)(table).map(slice(axes.x));

/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @param dimension The dimension to generate the slicer for.
 * @returns Returns a function that will take a table and slice it into an array of tables each conforming to the criteria of a point on a dimension.
  */
export const slice = <TRow>(dimension: Dimension<TRow>): Function<Table<TRow>, Array<Table<TRow>>> =>
	table => dimension.map(criteria => table.filter(row => criteria.every(criterion => criterion.predicate(row))));

/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export const map = <TRow, TResult>(source: Cube<TRow>, selector: Function<Table<TRow>, TResult>): Matrix<TResult> =>
	source.map(row => row.map(selector));

/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
export const filter = <TRow>(predicate: Predicate<TRow>): Function<Table<TRow>, Table<TRow>> =>
	table => table.filter(predicate);

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export const select = <TRow, TResult>(selector: Function<TRow, TResult>): Function<Table<TRow>, Array<TResult>> =>
	table => table.map(selector);

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export const sum = <TRow>(selector: Function<TRow, number>): Function<Table<TRow>, number | null> =>
	table => table ? table.reduce((total, row) => total + selector(row), 0) : null;

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export const average = <TRow>(selector: Function<TRow, number>): Function<Table<TRow>, number | null> =>
	table => table ? sum(selector)(table)! / count(table)! : null;

/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export const count = <TRow>(table: Table<TRow>): number | null =>
	table.length || null;
