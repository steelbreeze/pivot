import { Axis, Cube, Func, Key, Row, Table } from './types';

export namespace axis {
	/**
	 * Creates an axis based on the contents of a table.
	 * @param table The source table, an array of objects.
	 * @param key The name to give this axis.
	 * @param f An optional callback function to derive values from the source table objects. If omitted, the object attribute with the same name as the key is derived.
	 * @param s An optional callback function used to sort the values of the dimension. This conforms to the sort criteria used by Array.prototype.sort.
	 */
	export function fromTable<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, key: TKey, f: Func<TRow, TValue> = (row: TRow) => row[key], s?: (a: TValue, b: TValue) => number): Axis<TValue, TKey, TRow> {
		return fromValues(table.map(f).filter((value, index, source) => source.indexOf(value) === index).sort(s), key, f);
	}

	/**
	 * Creates an axis from an array of values.
	 * @param values The source values.
	 * @param key The name to give this dimension.
	 * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
	 */
	export function fromValues<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(values: Array<TValue>, key: TKey, f: Func<TRow, TValue> = (row: TRow) => row[key]): Axis<TValue, TKey, TRow> {
		return values.map(value => { return { predicate: row => f(row) === value, criteria: [{ key, value }] } });
	}

	/**
	 * Merge two axes together into a single axis.
	 * @param axis1 The first axis.
	 * @param axis2 The second axis.
	 */
	export function combine<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(axis1: Axis<TValue, TKey, TRow>, axis2: Axis<TValue, TKey, TRow>): Axis<TValue, TKey, TRow> {
		return axis2.reduce<Axis<TValue, TKey, TRow>>((result, s2) => [...result, ...axis1.map(s1 => { return { predicate: (row: TRow) => s2.predicate(row) && s1.predicate(row), criteria: [...s2.criteria, ...s1.criteria] } })], []);
	}
}

/**
 * Slices a table based on the critera specified by an axis.
 * @param table The source data, an array of rows.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, axis: Axis<TValue, TKey, TRow>): Array<Table<TValue, TKey, TRow>> {
	return axis.map(s => table.filter(s.predicate));
}

/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
export function pivot<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, y: Axis<TValue, TKey, TRow>, x: Axis<TValue, TKey, TRow>): Cube<TValue, TKey, TRow> {
	return slice(table, y).map(i => slice(i, x));
}

/**
 * Compacts a cube, removing empty rows or columns on the x any y axes.
 * @param cube The source cube.
 * @param y The first axis the cube was pivoted by.
 * @param x The second axis the cube was pivoted by.
 */
export function compact<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(cube: Cube<TValue, TKey, TRow>, y: Axis<TValue, TKey, TRow>, x: Axis<TValue, TKey, TRow>): void {
	const population = query(cube, count);

	for (let i = y.length; i--;) {
		if (!population[i].some(t => t)) {
			y.splice(i, 1);
			cube.splice(i, 1);
		}
	}

	for (let i = x.length; i--;) {
		if (!population.some(r => r[i])) {
			x.splice(i, 1);
			cube.forEach(r => r.splice(i, 1));
		}
	}
}

/**
 * Returns data queried from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result from each cell of the cube.
 */
export function query<TValue, TKey extends Key, TRow extends Row<TValue, TKey>, TResult>(cube: Cube<TValue, TKey, TRow>, f: Func<Table<TValue, TKey, TRow>, TResult>): Array<Array<TResult>> {
	return cube.map(y => y.map(f));
}

/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export function count<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>): number | null {
	return table.length || null;
}

/**
 *  generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param f A callback function to derive a numerical value for each row.
 */
export function sum<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(f: Func<TRow, number>): Func<Table<TValue, TKey, TRow>, number | null> {
	return table => table.length ? table.reduce((total, row) => total + f(row), 0) : null;
}

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param f A callback function to derive a numerical value for each row.
 */
export function average<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(f: Func<TRow, number>): Func<Table<TValue, TKey, TRow>, number | null> {
	return table => table.length ? sum(f)(table)! / count(table)! : null;
}