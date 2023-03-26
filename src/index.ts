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
export function distinct<TSource>(value: TSource, index: number, source: Array<TSource>): boolean {
	return source.indexOf(value) === index;
}

/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this predicate on.
 */
export function criteria<TSource>(key: keyof TSource): Function<TSource[keyof TSource], Predicate<TSource>> {
	return (criterion: TSource[keyof TSource]) => (value: TSource) => value[key] === criterion;
}

/**
 * Pivots source data by one dimension.
 * @param source The source data, an array of objects.
 * @param first The dimension used to pivot the source data.
 * @returns Returns a matrix, the source data sliced according to the dimension.
 */
export function pivot<TSource>(source: Array<TSource>, first: Dimension<TSource>): Matrix<TSource>;

/**
 * Pivots source data by two dimensions.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param second The second dimension used to pivot the source data.
 * @returns Returns a cube, the source data sliced according to the first dimension and diced according to the second dimension.
 */
export function pivot<TSource>(source: Array<TSource>, first: Dimension<TSource>, second: Dimension<TSource>): Cube<TSource>;

/**
 * Pivots source data by more than two dimensions returning an n-cube.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param dimensions Additional dimensions to pivot the source data by.
 * @returns Returns an n-cube (the type of which depends on how many dimensions are passed in, but minimally Cube<Array<TSource>> for three dimensions).
 */
export function pivot<TSource>(source: Array<TSource>, first: Dimension<TSource>, ...dimensions: Array<Dimension<TSource>>): Cube<any>;

// implemntation of the single pivot function satisfying all three of the function prototypes above
export function pivot<TSource>(source: Array<TSource>, first: Dimension<TSource>, second?: Dimension<TSource>, ...dimensions: Array<Dimension<TSource>>) {
	return first.map(predicate => second ? pivot(source.filter(predicate), second, ...dimensions) : source.filter(predicate));
}

/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
export function map<TSource, TResult>(cube: Cube<TSource>, query: Function<Array<TSource>, TResult>): Matrix<TResult> {
	return cube.map((matrix: Matrix<TSource>) => matrix.map(query));
}

/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export function sum<TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> {
	return (source: Array<TSource>) => source.reduce((total: number, source: TSource) => total + selector(source), 0);
}

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export function average<TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> {
	return (source: Array<TSource>) => sum(selector)(source) / source.length;
}