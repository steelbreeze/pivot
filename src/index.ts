/** A simple function taking an agrument and returning a result */
export type Function<TArg, TResult> = (arg: TArg) => TResult;

/** A predicate is a function returning a boolean result */
export type Predicate<TArg> = Function<TArg, boolean>;

/** A dimension is a series of predicates used to partition data. */
export type Dimension<TValue> = Array<Predicate<TValue>>;

/** A matrix is a two dimensional data structure. */
export type Matrix<TValue> = Array<Array<TValue>>;

/** A cube is a three dimensional data structure. */
export type Cube<TValue> = Array<Array<Array<TValue>>>;

// slice and dice the source data based on the number of dimensions passed
const pivotImplementation = <TValue>(source: Array<TValue>, first: Dimension<TValue>, second?: Dimension<TValue>, ...others: Array<Dimension<TValue>>): Matrix<any> => {
	const matrix: Matrix<TValue> = first.map(() => []);

	for (var si = 0; si < source.length; ++si) {
		const value = source[si];

		for (var di = 0; di < first.length; ++di) {
			if (first[di](value)) {
				matrix[di].push(value);

				break;
			}
		}
	}

	return second ? matrix.map((slice: Array<TValue>) => pivotImplementation(slice, second, ...others)) : matrix;
}

/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @typeParam TValue The type of the source data.
 * @param key The property in the source data to base this predicate on.
 */
export const criteria = <TValue>(key: keyof TValue): Function<TValue[keyof TValue], Predicate<TValue>> =>
	(criterion: TValue[keyof TValue]) => (value: TValue) => value[key] === criterion;

/**
 * Pivots source data by one or more dimensions returning an n-cube.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param second The second dimension used to pivot the source data.
 * @param third The third dimension used to pivot the source data.
 * @param others Additional dimensions to pivot the source data by.
 * @returns Returns an n-cube, the type of which depends on how many dimensions are passed in: Matrix<TValue> for one dimension; Cube<TValue> for two dimension; Cube<Array<TValue> for three dimensions, etc..
 */
export const pivot: {
	<TValue>(source: Array<TValue>, first: Dimension<TValue>): Matrix<TValue>;
	<TValue>(source: Array<TValue>, first: Dimension<TValue>, second: Dimension<TValue>): Cube<TValue>;
	<TValue>(source: Array<TValue>, first: Dimension<TValue>, second: Dimension<TValue>, third: Dimension<TValue>, ...others: Array<Dimension<TValue>>): Cube<Array<any>>;
} = pivotImplementation;

/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @typeParam TValue The type of the source data.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
export const map = <TValue, TResult>(cube: Cube<TValue>, query: Function<Array<TValue>, TResult>): Matrix<TResult> =>
	cube.map((matrix: Matrix<TValue>) => matrix.map(query));

/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export const sum = <TValue>(selector: Function<TValue, number>): Function<Array<TValue>, number> =>
	(source: Array<TValue>) => source.reduce((total: number, source: TValue) => total + selector(source), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export const average = <TValue>(selector: Function<TValue, number>): Function<Array<TValue>, number> =>
	(source: Array<TValue>) => sum(selector)(source) / source.length;

/** Function to pass into Array.prototype.filter to return unique values */
export const distinct = <TValue>(value: TValue, index: number, source: Array<TValue>): boolean =>
	source.indexOf(value) === index;
