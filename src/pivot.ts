/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

/** A key and value of that key to use when slicing data in a pivot operation and the filter to evaluate it. */
export type Criterion<TRow, TValue> = { key: string | number, value: TValue, f: Func<TRow, boolean> };

/** A set of criterion representing a single dimension. */
export type Dimension<TRow, TValue> = Array<Criterion<TRow, TValue>>;

/** A cartesian product of multiple dimensions. */
export type Axis<TRow, TValue> = Array<Dimension<TRow, TValue>>;

/** A table of data. */
export type Table<TRow> = Array<TRow>;

/** A cube of data. */
export type Cube<TRow> = Array<Array<Table<TRow>>>;

/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 * @param s An optional callback function used to sort the values of the dimension, conforming to Array.prototype.sort.
 */
export function dimension<TRow, TValue>(table: Table<TRow>, key: string | number, f: Func<TRow, TValue> = (row: TRow) => row[key], s?: (a: TValue, b: TValue) => number): Dimension<TRow, TValue> {
	return dimension.make(table.map(f).filter((value, index, source) => source.indexOf(value) === index).sort(s), key, f);
}

/**
 * Creates a dimension from an array of values.
 * @param source The source values.
 * @param key The name to give this dimension.
 * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
dimension.make = function <TRow, TValue>(source: Array<TValue>, key: string | number, f: Func<TRow, TValue> = (row: TRow) => row[key]): Dimension<TRow, TValue> {
	return source.map(value => { return { key, value, f: row => f(row) === value } });
}

/**
 * Combines one of more dimensions into an axis, the axis is the cartesian product of all dimension values.
 * @param dimensions The set of dimensions to turn into an axis.
 */
export function axis<TRow, TValue>(...dimensions: Array<Dimension<TRow, TValue>>): Axis<TRow, TValue> {
	return dimensions.reduce<Axis<TRow, TValue>>((axis, dimension) => axis.flatMap(criteria => dimension.map(criterion => [...criteria, criterion])), [[]]); // NOTE: this is just a generic cartesian product algorithm
}

/**
 * Slices a table based on the critera specified by a single axis.
 * @param table The source data, an array of JavaScript objects.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice<TRow, TValue>(table: Table<TRow>, axis: Axis<TRow, TValue>): Array<Table<TRow>> {
	return axis.map(criteria => table.filter(criteria.map(criterion => criterion.f).reduce((a, b) => row => a(row) && b(row))));
}

/**
 * Pivots a table by 1..n axis
 * @param table The source data, an array of JavaScript objects.
 * @param y The first axis to pivot the table by.
 * @param axes 0..n subsiquent axes to pivot the table by.
 */
export function pivot<TRow, TValue>(table: Table<TRow>, y: Axis<TRow, TValue>, x: Axis<TRow, TValue>): Cube<TRow> {
	return slice(table, y).map(interim => slice(interim, x));
}

/**
 * Compacts a cube and axes where row or columns have no values.
 * @param cube The cube to compact.
 * @param y The y axis to compact.
 * @param x The x axis to compact.
 */
export function compact<TRow, TValue>(cube: Cube<TRow>, y: Axis<TRow, TValue>, x: Axis<TRow, TValue>): void {
	const population = query(cube, count);

	for (let i = population.length; i--;) {
		if (!population[i].some(t => t)) {
			y.splice(i, 1);
			cube.splice(i, 1);
		}
	}

	for (let i = population[0].length; i--;) {
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