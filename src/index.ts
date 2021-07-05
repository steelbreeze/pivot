/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

/** A function taking one argument and returning a boolean result. */
export type Predicate<TArg> = Func<TArg, boolean>;

/** The type of keys used throughout the library. */
export type Key = string | number;

/** A set of attributes, each entry addressable via a key. */
export type Row<TValue, TKey extends Key> = { [T in TKey]: TValue };

/** A pair consiting of a key and value. */
export type Pair<TValue, TKey extends Key> = { key: TKey, value: TValue };

export type Axis<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<{ p: Predicate<TRow>, pairs: Array<Pair<TValue, TKey>> }>;

/** A table of data. */
export type Table<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<TRow>;

/** A cube of data. */
export type Cube<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<Array<Table<TValue, TKey, TRow>>>;

/** Static class acting as a namespace for axis related functions. */
export class axis {
	/**
	 * Creates an axis based on the contents of a table.
	 * @param table The source table, an array of objects.
	 * @param key The name to give this axis.
	 * @param selector An optional callback function to derive the axis values from the source table row. If omitted, the object attribute with the same name as the key is derived.
	 * @param sorter An optional callback function used to sort the values of the dimension. This conforms to the sort criteria used by Array.prototype.sort.
	 */
	static fromTable<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, key: TKey, selector: Func<TRow, TValue> = (row: TRow) => row[key], sorter?: (a: TValue, b: TValue) => number): Axis<TValue, TKey, TRow> {
		return axis.fromValues(table.map(selector).filter((value, index, source) => source.indexOf(value) === index).sort(sorter), key, selector);
	}

	/**
	 * Creates an axis from an array of values.
	 * @param values The source values.
	 * @param key The name to give this dimension.
	 * @param selector An optional callback function used to convert values in the source table to those in the dimension when pivoting.
	 */
	static fromValues<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(values: Array<TValue>, key: TKey, selector: Func<TRow, TValue> = (row: TRow) => row[key]): Axis<TValue, TKey, TRow> {
		return values.map(value => { return { p: row => selector(row) === value, pairs: [{ key, value }] } });
	}

	/**
	 * Merge two axes together into a single axis.
	 * @param axis1 The first axis.
	 * @param axis2 The second axis.
	 */
	static join<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(axis1: Axis<TValue, TKey, TRow>, axis2: Axis<TValue, TKey, TRow>): Axis<TValue, TKey, TRow> {
		return axis1.reduce<Axis<TValue, TKey, TRow>>((result, s1) => [...result, ...axis2.map(s2 => { return { p: (row: TRow) => s1.p(row) && s2.p(row), pairs: [...s1.pairs, ...s2.pairs] } })], []);
	}
}

/**
 * Slices a table based on the critera specified by an axis.
 * @param table The source data, an array of rows.
 * @param axis The result of a call to axis with one or more dimensions.
 */
export function slice<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, axis: Axis<TValue, TKey, TRow>): Array<Table<TValue, TKey, TRow>> {
	return axis.map(s => table.filter(s.p));
}

/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
export function cube<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, y: Axis<TValue, TKey, TRow>, x: Axis<TValue, TKey, TRow>): Cube<TValue, TKey, TRow> {
	return slice(table, y).map(i => slice(i, x));
}

/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 */
export function filter<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(cube: Cube<TValue, TKey, TRow>, predicate: Predicate<TRow>): Cube<TValue, TKey, TRow> {
	return cube.map(y => y.map(x => x.filter(predicate)));
}

/**
 * Queries data from a cube.
 * @param cube The source cube.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export function map<TValue, TKey extends Key, TRow extends Row<TValue, TKey>, TResult>(cube: Cube<TValue, TKey, TRow>, selector: Func<Table<TValue, TKey, TRow>, TResult>): Array<Array<TResult>> {
	return cube.map(y => y.map(selector));
}

/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export function select<TValue, TKey extends Key, TRow extends Row<TValue, TKey>, TResult>(selector: Func<TRow, TResult>): Func<Table<TValue, TKey, TRow>, TResult[]> {
	return table => table.map(selector);
}

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export function sum<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(selector: Func<TRow, number>): Func<Table<TValue, TKey, TRow>, number | null> {
	return table => table ? table.reduce((total, row) => total + selector(row), 0) : null;
}

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export function average<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(selector: Func<TRow, number>): Func<Table<TValue, TKey, TRow>, number | null> {
	return table => table ? sum(selector)(table)! / count(table)! : null;
}

/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
 export function count<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>): number | null {
	return table.length || null;
}
