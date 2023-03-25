import { Callback, Function, Predicate } from '@steelbreeze/types';

/** A dimension is a series of criteria used to partition data. */
export type Dimension<TSource> = Array<Predicate<TSource>>;

/** A matrix is a two dimensional data structure. */
export type Matrix<TSource> = Array<Array<TSource>>;

/** A cube is a three dimensional data structure. */
export type Cube<TSource> = Array<Array<Array<TSource>>>;

/**
 * Create a callback to used in a map operation to create the criteria for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this criteria on.
 */
export const criteria = <TSource>(key: keyof TSource): Function<TSource[keyof TSource], Predicate<TSource>> =>
	(value: TSource[keyof TSource]) => (obj: TSource) => obj[key] === value;

/**
 * Pivots source data by n dimensions returning an n-cube.
 * @param source The source data, an array of objects.
 * @param dimensions The dimensions to use to pivot the n-cube.
 * @returns Returns an n-cube; minimally a Matrix if only one dimension passed, a Cube if two dimensions passed, and so one as more dimensions added.
 */
export const pivot = <TSource>(source: Array<TSource>, [first, ...remaining]: Array<Dimension<TSource>>): Matrix<any> =>
	first.map(criteria => remaining.length ? pivot(source.filter(criteria), remaining) : source.filter(criteria));

/**
 * Queries data from a cube.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
export const map = <TSource, TResult>(cube: Cube<TSource>, query: Callback<Array<TSource>, TResult>): Matrix<TResult> =>
	cube.map((matrix: Matrix<TSource>) => matrix.map(query));

/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
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
