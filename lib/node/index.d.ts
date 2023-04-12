/** A simple function taking an agrument and returning a result */
export declare type Function<TArg, TResult> = (arg: TArg) => TResult;
/** A predicate is a function returning a boolean result */
export declare type Predicate<TArg> = Function<TArg, boolean>;
/** A dimension is a series of predicates used to partition data. */
export declare type Dimension<TValue> = Array<Predicate<TValue>>;
/** A matrix is a two dimensional data structure. */
export declare type Matrix<TValue> = Array<Array<TValue>>;
/** A cube is a three dimensional data structure. */
export declare type Cube<TValue> = Array<Array<Array<TValue>>>;
/** Function to pass into Array.prototype.filter to return unique values */
export declare const distinct: <TValue>(value: TValue, index: number, source: TValue[]) => boolean;
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @typeParam TValue The type of the source data.
 * @param key The property in the source data to base this predicate on.
 */
export declare const criteria: <TValue>(key: keyof TValue) => Function<TValue[keyof TValue], Predicate<TValue>>;
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
export declare const pivot: {
    <TValue>(source: Array<TValue>, first: Dimension<TValue>): Matrix<TValue>;
    <TValue>(source: Array<TValue>, first: Dimension<TValue>, second: Dimension<TValue>): Cube<TValue>;
    <TValue>(source: Array<TValue>, first: Dimension<TValue>, second: Dimension<TValue>, third: Dimension<TValue>, ...others: Array<Dimension<TValue>>): Cube<Array<any>>;
};
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
