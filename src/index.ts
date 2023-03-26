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
 * @param first The first dimension to pivot the source data by.
 * @param second An optional second dimension to pivot the source data by.
 * @param further 0-n further dimensions to pivot the source data by.
 * @returns Returns an n-cube; minimally a Matrix if only the first dimension is passed, a Cube if two dimensions passed, and so one as more dimensions added.
 */
export const pivot = <TSource>(source: Array<TSource>, first: Dimension<TSource>, second?: Dimension<TSource>, ...further: Array<Dimension<TSource>>): Matrix<any> =>
	first.map(predicate => second ? pivot(source.filter(predicate), second, ...further) : source.filter(predicate));

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
