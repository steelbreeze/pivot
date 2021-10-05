/** A function taking one argument and returning a result. */
export type Func1<TArg1, TResult> = (arg: TArg1) => TResult;

/** A function taking two arguments and returning a result. */
export type Func2<TArg1, TArg2, TResult> = (arg1: TArg1, arg2: TArg2) => TResult;

/** A function taking one argument and returning a boolean result. */
export type Predicate<TArg> = Func1<TArg, boolean>;

/** The type of values used in source data structures. */
export type Value = any;

/** The type of keys used to reference values in data structures. */
export type Key = Exclude<keyof Value, symbol>;

/** A set of attributes in a row of a table, each addressable via a key. */
export type Row = Record<Key, Value>;

/** A key and value for that key. */
export interface Pair {
	/** The key, or column name to test. */
	key: Key;

	/** The expected value. */
	value: Value;
}

/** A criterion used to test rows of data against. */
export interface Criterion<TRow extends Row> extends Pair {
	/**
	 * A predicate based on the key and value used to evaluate the criterion.
	 * @hidden
	 */
	f: Predicate<TRow>;
}

/** The set of critera to used for a point on a dimension. */
export type Criteria<TRow extends Row> = Array<Criterion<TRow>>;

/** An dimension to pivot a table by. */
export type Dimension<TRow extends Row> = Array<Criteria<TRow>>;

/** A pair of axes to be used in a pivot operation. */
export interface Axes<TRow extends Row> {
	/** The x axis; columns in the resultant pivot table. */
	x: Dimension<TRow>;

	/** The y axis; rows in the resultant pivot table. */
	y: Dimension<TRow>;
}

/** A table of data. */
export type Table<TRow extends Row> = Array<TRow>;

/** A cube of data. */
export type Cube<TRow extends Row> = Array<Array<Table<TRow>>>;

/** Options passed into the deriveDimension function. */
export interface Options<TRow extends Row> {
	/** An optional user-defined function to derive a value from the source data to be used in the dimension. */
	get?: Func1<TRow, Value>;

	/** An optional user-defined function to determin the ordering of the dimension. */
	sort?: Func2<Value, Value, number>;
}

/**
 * Creates a dimension from an array of values.
 * @param values The source values.
 * @param key The name to give this dimension.
 * @param get An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
export function dimension<TRow extends Row>(values: Array<Value>, key: Key, get: Func1<TRow, Value> = row => row[key]): Dimension<TRow> {
	return values.map(value => [{ key, value, f: row => get(row) === value }]);
}

/**
 * Creates a derived dimension based on the contents of column in a table.
 * @param table The source table, an array of objects.
 * @param key The name to give this dimension.
 * @param options An optional structure, containing two configuration parameters: get, a callback function used to convert values in the source table to those in the dimension when pivoting; sort, a method used to sort the values in the axis.
 */
export function deriveDimension<TRow extends Row>(table: Table<TRow>, key: Key, options: Options<TRow> = {}): Dimension<TRow> {
	return dimension(table.map(options.get || (row => row[key])).filter((value, index, source) => source.indexOf(value) === index).sort(options.sort), key, options.get);
}

/**
 * Create a composite dimension from others. This creates a cartesian product of the source dimensions criteria.
 * @param dimensions An array of dimensions to combine into one.
 */
export function join<TRow extends Row>(...dimensions: Array<Dimension<TRow>>): Dimension<TRow> {
	return dimensions.reduce((result, dimension) => result.flatMap(c1 => dimension.map(c2 => [...c1, ...c2])));
}

/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 */
export function cube<TRow extends Row>(table: Table<TRow>, axes: Axes<TRow>): Cube<TRow> {
	return slice(table, axes.y).map(table => slice(table, axes.x));
}

/**
 * Slices data by the criteria specified in a dimension.
 * @hidden
 */
function slice<TRow extends Row>(table: Table<TRow>, axis: Dimension<TRow>): Array<Table<TRow>> {
	return axis.map(criteria => table.filter(row => criteria.every(criterion => criterion.f(row))));
}

/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 */
export function filter<TRow extends Row>(cube: Cube<TRow>, predicate: Predicate<TRow>): Cube<TRow> {
	return cube.map(row => row.map(cell => cell.filter(predicate)));
}

/**
 * Queries data from a cube.
 * @param cube The source cube.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export function map<TRow extends Row, TResult>(cube: Cube<TRow>, selector: Func1<Table<TRow>, TResult>): Array<Array<TResult>> {
	return cube.map(row => row.map(selector));
}

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export function select<TRow extends Row, TResult>(selector: Func1<TRow, TResult>): Func1<Table<TRow>, Array<TResult>> {
	return table => table.map(selector);
}

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export function sum<TRow extends Row>(selector: Func1<TRow, number>): Func1<Table<TRow>, number | null> {
	return table => table ? table.reduce((total, row) => total + selector(row), 0) : null;
}

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export function average<TRow extends Row>(selector: Func1<TRow, number>): Func1<Table<TRow>, number | null> {
	return table => table ? sum(selector)(table)! / count(table)! : null;
}

/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export function count<TRow extends Row>(table: Table<TRow>): number | null {
	return table.length || null;
}
