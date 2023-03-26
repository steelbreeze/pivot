/** A predicate is a simple function returning a boolean result */
export declare type Function<TArg, TResult> = (arg: TArg) => TResult;
/** A predicate is a simple function returning a boolean result */
export declare type Predicate<TArg> = Function<TArg, boolean>;
/** A dimension is a series of predicates used to partition data. */
export declare type Dimension<TSource> = Array<Predicate<TSource>>;
/** A matrix is a two dimensional data structure. */
export declare type Matrix<TSource> = Array<Array<TSource>>;
/** A cube is a three dimensional data structure. */
export declare type Cube<TSource> = Array<Array<Array<TSource>>>;
/** Function to pass into Array.prototype.filter to return unique values */
export declare const distinct: <TSource>(value: TSource, index: number, source: TSource[]) => boolean;
/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this predicate on.
 */
export declare const criteria: <TSource>(key: keyof TSource) => Function<TSource[keyof TSource], Predicate<TSource>>;
/**
 * Pivots source data by one or more dimensions returning an n-cube.
 * @param source The source data, an array of objects.
 * @param first The first dimension to pivot the source data by.
 * @param second An optional second dimension to pivot the source data by.
 * @param further 0-n further dimensions to pivot the source data by.
 * @returns Returns an n-cube; minimally a Matrix if only the first dimension is passed, a Cube if two dimensions passed, and so one as more dimensions added.
 */
export declare const pivot: <TSource>(source: TSource[], first: Dimension<TSource>, second?: Dimension<TSource> | undefined, ...further: Dimension<TSource>[]) => Matrix<any>;
/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 */
export declare const map: <TSource, TResult>(cube: Cube<TSource>, query: Function<TSource[], TResult>) => Matrix<TResult>;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export declare const sum: <TSource>(selector: Function<TSource, number>) => Function<TSource[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 */
export declare const average: <TSource>(selector: Function<TSource, number>) => Function<TSource[], number>;
