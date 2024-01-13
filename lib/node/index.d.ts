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
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @typeParam TValue The type of the source data.
 * @param key The property in the source data to base this predicate on.
 */
export declare const criteria: <TValue>(key: keyof TValue) => Function<TValue[keyof TValue], Predicate<TValue>>;
/**
 * Pivots source data by one dimension returning a matrix.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 */
export declare function pivot<TValue>(source: Array<TValue>, first: Dimension<TValue>): Matrix<TValue>;
/**
 * Pivots source data by two dimensions returning a cube.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param second The second dimension used to pivot the source data.
 */
export declare function pivot<TValue>(source: Array<TValue>, first: Dimension<TValue>, second: Dimension<TValue>): Cube<TValue>;
/**
 * Pivots source data by three or more dimensions returning an n-cube.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param first The first dimension used to pivot the source data.
 * @param others Additional dimensions to pivot the source data by.
 */
export declare function pivot<TValue>(source: Array<TValue>, ...[first, ...others]: Array<Dimension<TValue>>): Cube<any>;
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @typeParam TValue The type of the source data.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
export declare const map: <TValue, TResult>(cube: Cube<TValue>, query: Function<TValue[], TResult>) => Matrix<TResult>;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export declare const sum: <TValue>(selector: Function<TValue, number>) => Function<TValue[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @typeParam TValue The type of the source data.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export declare const average: <TValue>(selector: Function<TValue, number>) => Function<TValue[], number>;
/** Function to pass into Array.prototype.filter to return unique values */
export declare const distinct: <TValue>(value: TValue, index: number, source: TValue[]) => boolean;
