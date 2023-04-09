/** A predicate is a simple function returning a boolean result */
export type Function<TArg, TResult> = (arg: TArg) => TResult;

/** A predicate is a simple function returning a boolean result */
export type Predicate<TArg> = Function<TArg, boolean>;

/** A dimension is a series of predicates used to partition data. */
export type Dimension<TSource> = Array<Predicate<TSource>>;

/** A matrix is a two dimensional data structure. */
export type Matrix<TSource> = Array<Array<TSource>>;

/** A cube is a three dimensional data structure. */
export type Cube<TSource> = Array<Array<Array<TSource>>>;

/** Function to pass into Array.prototype.filter to return unique values */
export const distinct = <TSource>(value: TSource, index: number, source: Array<TSource>): boolean =>
	source.indexOf(value) === index;

/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this predicate on.
 */
export const criteria = <TSource>(key: keyof TSource): Function<TSource[keyof TSource], Predicate<TSource>> =>
	(criterion: TSource[keyof TSource]) => (value: TSource) => value[key] === criterion;

/**
 * Pivots source data by one or more dimensions returning an n-cube.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param second The second dimension used to pivot the source data.
 * @param third The third dimension used to pivot the source data.
 * @param others Additional dimensions to pivot the source data by.
 * @returns Returns an n-cube, the type of which depends on how many dimensions are passed in: Matrix<TSource> for one dimension; Cube<TSource> for two dimension; Cube<Array<TSource> for three dimensions, etc..
 */
export const pivot: {
	<TSource>(source: Array<TSource>, first: Dimension<TSource>): Matrix<TSource>;
	<TSource>(source: Array<TSource>, first: Dimension<TSource>, second: Dimension<TSource>): Cube<TSource>;
	<TSource>(source: Array<TSource>, first: Dimension<TSource>, second: Dimension<TSource>, third: Dimension<TSource>, ...others: Array<Dimension<TSource>>): Cube<Array<any>>;
} = <TSource>(source: Array<TSource>, first: Dimension<TSource>, second?: Dimension<TSource>, ...others: Array<Dimension<TSource>>): Matrix<any> => pivotImplementation([...source], first, second, ...others);

// implemntation of the pivot function. Note, this needs to be seperate from the external API as the recursion within does not use the external API; it also destroys the source passed in.
const pivotImplementation = <TSource>(source: Array<TSource>, first: Dimension<TSource>, second?: Dimension<TSource>, ...others: Array<Dimension<TSource>>): Matrix<any> =>
	first.map(predicate => second ? pivotImplementation(slice(source, predicate), second, ...others) : slice(source, predicate));

// slice an array in two, returning records that match the predicate and removing them from the source.
const slice = <TSource>(source: Array<TSource>, predicate: Predicate<TSource>): Array<TSource> => {
	let index = 0, remaining = 0;
	let record, filtered: Array<TSource> = [];

	for (; index < source.length; ++index) {
		record = source[index];

		if (predicate(record)) {
			filtered.push(record);
		} else {
			if (index !== remaining) {
				source[remaining] = record;
			}

			++remaining;
		}
	}

	source.length = remaining;

	return filtered;
}

/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
export const map = <TSource, TResult>(cube: Cube<TSource>, query: Function<Array<TSource>, TResult>): Matrix<TResult> =>
	cube.map((matrix: Matrix<TSource>) => matrix.map(query));

/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export const sum = <TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> =>
	(source: Array<TSource>) => source.reduce((total: number, source: TSource) => total + selector(source), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export const average = <TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> =>
	(source: Array<TSource>) => sum(selector)(source) / source.length;
