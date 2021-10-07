/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

/** A function taking one argument and returning a boolean result. */
export type Predicate<TArg> = Func<TArg, boolean>;

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

/** The set of critera to used for a point on a dimension. */
export type Criteria<TRow extends Row> = Array<Predicate<TRow> & Pair>;

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

/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
export function distinct<TRow extends Row>(table: Table<TRow>, key: Key, getValue: Func<TRow, Value> = row => row[key]): Array<Value> {
	const unique: Array<Value> = [];

	for(const row of table) {
		const value = getValue(row);
	
		if(!unique.includes(value)) {
			unique.push(value);
		}
	}
	
	return unique;
}

/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export function dimension<TRow extends Row>(values: Array<Value>, key: Key, getValue: Func<TRow, Value> = row => row[key]): Dimension<TRow> {
	return values.map(value => [Object.assign((row: TRow) => getValue(row) === value, { key, value })]);
}

/**
 * Create a composite dimension from others. This creates a cartesian product of the source dimensions criteria.
 * @param dimensions An array of dimensions to combine into one.
 * @returns Returns a complex dimension with criteria being the cartesian product of the source dimensions.
 */
export function join<TRow extends Row>(...dimensions: Array<Dimension<TRow>>): Dimension<TRow> {
	return dimensions.reduce((result, dimension) => result.flatMap(c1 => dimension.map(c2 => [...c1, ...c2])));
}

/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export function cube<TRow extends Row>(table: Table<TRow>, axes: Axes<TRow>): Cube<TRow> {
	return slice(table, axes.y).map(table => slice(table, axes.x));
}

/**
 * Slices data by the criteria specified in a dimension.
 * @param table The source table, an array of objects.
 * @param dimension A dimension to slice the source table by.
 * @returns A set of tables, filtered by the dimensions criteria.
 */
export function slice<TRow extends Row>(table: Table<TRow>, dimension: Dimension<TRow>): Array<Table<TRow>> {
	return dimension.map(criteria => table.filter(row => criteria.every(criterion => criterion(row))));
}

/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 * @returns Returns a copy of the cube, with the contents of each cell filtered by the predicate.
 */
export function filter<TRow extends Row>(cube: Cube<TRow>, predicate: Predicate<TRow>): Cube<TRow> {
	return cube.map(row => row.map(cell => cell.filter(predicate)));
}

/**
 * Queries data from a cube.
 * @param cube The source cube.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export function map<TRow extends Row, TResult>(cube: Cube<TRow>, selector: Func<Table<TRow>, TResult>): Array<Array<TResult>> {
	return cube.map(row => row.map(selector));
}

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export function select<TRow extends Row, TResult>(selector: Func<TRow, TResult>): Func<Table<TRow>, Array<TResult>> {
	return table => table.map(selector);
}

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export function sum<TRow extends Row>(selector: Func<TRow, number>): Func<Table<TRow>, number | null> {
	return table => table ? table.reduce((total, row) => total + selector(row), 0) : null;
}

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export function average<TRow extends Row>(selector: Func<TRow, number>): Func<Table<TRow>, number | null> {
	return table => table ? sum(selector)(table)! / count(table)! : null;
}

/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export function count<TRow extends Row>(table: Table<TRow>): number | null {
	return table.length || null;
}
