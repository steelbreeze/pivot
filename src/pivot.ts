/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

/** A single data point. */
export type Value = any;

/** The type of keys used to index the values. */
export type Key = string | number;

/** A row of data that is indexed by a key. */
export type Row = { [TKey in Key]: Value };

/** A table of data. */
export type Table<TRow extends Row> = TRow[];

/** A cube of data. */
export type Cube<TRow extends Row> = Table<TRow>[][];

/** A key and value of that key to use when slicing data in a pivot operation and the filter to evaluate it. */
export type Criterion<TRow extends Row> = { key: Key, value: Value, f: Func<TRow, boolean> };

/** A set of criterion representing the citeria for a single dimension. */
export type Dimension<TRow extends Row> = Criterion<TRow>[];

/** The cartesean product of multiple dimensions, allowing a pivot to use multiple dimensions for each of the x and y axis. */
export type Axis<TRow extends Row> = Dimension<TRow>[];

/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 */
export function dimension<TRow extends Row>(table: Table<TRow>, key: Key, f: Func<TRow, Value> = row => row[key]): Dimension<TRow> {
	return dimension.make(table.map(f).filter((value, index, source) => source.indexOf(value) === index).sort(), key, f);
}

/**
 * Creates a dimension from an array of values.
 * @param source The source values.
 * @param key The name to give this dimension.
 * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
dimension.make = function <TRow extends Row>(source: Value[], key: Key, f: Func<TRow, Value> = row => row[key]): Dimension<TRow> {
	return source.map(value => { return { key, value, f: row => f(row) === value } });
}

/**
 * Combines one of more dimensions into an axis, the axis is the cartesean product of all dimension values.
 * @param dimensions The set of dimensions to turn into an axis.
 */
export function axis<TRow extends Row>(...dimensions: Dimension<TRow>[]): Axis<TRow> {
	// create the cartesean product of all dimension values
	return dimensions.reduce<Axis<TRow>>((axis, dimension) => axis.flatMap(criteria => dimension.map(criterion => [...criteria, criterion])), [[]]);
}

/**
 * Slices a table based on the critera specified by a single axis.
 * @param table The source data, an array of JavaScript objects.
 * @param axis The result of a call to axis with one or more dimensions.
 */
function slice<TRow extends Row>(table: Table<TRow>, axis: Axis<TRow>): Table<TRow>[] {
	// map the axis criteria into a set of filters then slice the table
	return axis.map(criteria => table.filter(criteria.map(criterion => criterion.f).reduce((a, b) => row => a(row) && b(row)))); // TODO: move criterion aggregation into axis creation?
}

/**
 * Pivots a table by 1..n axis
 * @param table The source data, an array of JavaScript objects.
 * @param axes 1..n Axis to pivot the table by.
 */
export function pivot<TRow extends Row>(table: Table<TRow>, ...axes: Axis<TRow>[]) {
	return axes.reduce<any[]>((res, axis) => res.map(interim => slice(interim, axis)), slice(table, axes.shift()!));
}

/**
 * Selects data from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result for the table in each cell of the cube.
 */
export function query<TRow extends Row, TResult extends Value>(cube: Cube<TRow>, f: Func<Table<TRow>, TResult>): Table<Row> {
	return cube.map(y => y.map(f));
}

/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export function count<TRow extends Row>(table: Table<TRow>): number | null {
	return table.length || null;
}

/**
 * Sums numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
export function sum<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null> {
	return table => table.length ? table.reduce((total, row) => total + f(row), 0) : null;
}

/**
 * Averages numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
export function average<TRow extends Row>(f: Func<TRow, number>): Func<Table<TRow>, number | null> {
	return table => table.length ? sum(f)(table)! / count(table)! : null;
}
