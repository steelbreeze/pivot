import { Axis, Cube, Func, Key, Row, Table } from './types';

/**
 * Creates an axis based on the contents of a table.
 * @param table The source table, an array of objects.
 * @param key The name to give this axis.
 * @param f An optional callback function to derive values from the source table objects. If omitted, the object attribute with the same name as the key is derived.
 * @param s An optional callback function used to sort the values of the dimension. This conforms to the sort criteria used by Array.prototype.sort.
 */
export function axis<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TRow>, key: TKey, f: Func<TRow, TValue> = (row: TRow) => row[key], s?: (a: TValue, b: TValue) => number): Axis<TValue, TKey, TRow> {
	return axis.make(table.map(f).filter((value, index, source) => source.indexOf(value) === index).sort(s), key, f);
}

/**
 * Creates an axis from an array of values.
 * @param source The source values.
 * @param key The name to give this dimension.
 * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
axis.make = function <TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(source: Array<TValue>, key: TKey, f: Func<TRow, TValue> = (row: TRow) => row[key]): Axis<TValue, TKey, TRow> {
	return source.map(value => { return { predicate: row => f(row) === value, meta: [{ key, value }] } });
}

axis.compose = function <TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(...axes: Array<Axis<TValue, TKey, TRow>>): Axis<TValue, TKey, TRow> {
	let result: Axis<TValue, TKey, TRow> = [];

	// TODO: swap this with a reduce call
	for (const axis of axes) {
		if (!result.length) {
			result = axis;//.map(c => { return { predicate: c.predicate, meta: c.meta } });
		} else {
			let tmp: Axis<TValue, TKey, TRow> = [];

			for (const i0 of axis) {
				for (const i1 of result) {
					tmp.push({ predicate: row => i0.predicate(row) && i1.predicate(row), meta: [...i0.meta, ...i1.meta] });
				}
			}

			result = tmp;
		}
	}

	return result;
}

//export function axis<TRow, TValue>(...dimensions: Array<Dimension<TRow, TValue>>): Axis<TRow, TValue> {
//	return dimensions.reduce<Axis<TRow, TValue>>((axis, dimension) => axis.flatMap(criteria => dimension.map(criterion => [...criteria, criterion])), [[]]); // NOTE: this is just a generic cartesian product algorithm
//}

/**
 * Slices a table based on the critera specified by a single axis.
 * @param table The source data, an array of JavaScript objects.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TRow>, axis: Axis<TValue, TKey, TRow>): Array<Table<TRow>> {
	return axis.map(criteria => table.filter(criteria.predicate));
}

/**
 * Pivots a table by 1..n axis
 * @param table The source data, an array of JavaScript objects.
 * @param y The first axis to pivot the table by.
 * @param axes 0..n subsiquent axes to pivot the table by.
 */
export function pivot<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TRow>, y: Axis<TValue, TKey, TRow>, x: Axis<TValue, TKey, TRow>): Cube<TRow> {
	return slice(table, y).map(interim => slice(interim, x));
}

//export function compact<TRow, TValue>(cube: Cube<TRow>, y: Axis<TRow, TValue>, x: Axis<TRow, TValue>): void {
//	const population = query(cube, count);
//
//	for (let i = population.length; i--;) {
//		if (!population[i].some(t => t)) {
//			y.splice(i, 1);
//			cube.splice(i, 1);
//		}
//	}
//
//	for (let i = population[0].length; i--;) {
//		if (!population.some(r => r[i])) {
//			x.splice(i, 1);
//			cube.forEach(r => r.splice(i, 1));
//		}
//	}
//}

/**
 * Returns data queried from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result from each cell of the cube.
 */
export function query<TRow, TValue, TResult extends TValue>(cube: Cube<TRow>, f: Func<Table<TRow>, TResult>): Table<Array<TResult>> {
	return cube.map(y => y.map(f));
}

/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export function count<TRow>(table: Table<TRow>): number | null {
	return table.length || null;
}

/**
 *  generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param f A callback function to derive a numerical value for each row.
 */
export function sum<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null> {
	return table => table.length ? table.reduce((total, row) => total + f(row), 0) : null;
}

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param f A callback function to derive a numerical value for each row.
 */
export function average<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null> {
	return table => table.length ? sum(f)(table)! / count(table)! : null;
}