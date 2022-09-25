import { Callback, Pair, Predicate } from '@steelbreeze/types';
/** The type of values that can be in a row. */
export declare type Value = any;
/** The type of keys supported. */
export declare type Key = keyof Value;
/** The type of rows supported. */
export declare type Row = {
    [key in Key]: Value;
};
/** A predicate used to determine if a row of data is associated with a point of a dimension and its associated metadata (used for labelling purposes). */
export declare type Criteria<TRow> = Predicate<TRow> & {
    metadata: Array<Pair<Key, Value>>;
};
/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export declare type Dimension<TRow> = Array<Criteria<TRow>>;
/** A matrix is a two-dimensional data structure. */
export declare type Matrix<TSource> = Array<Array<TSource>>;
/** A cube of data. */
export declare type Cube<TSource> = Matrix<Array<TSource>>;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param createCriteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export declare const dimension: <TRow extends Row>(values: Array<Value>, key: Key, createCriteria?: Callback<any, Criteria<TRow>>) => Dimension<TRow>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export declare const cube: <TRow>(table: TRow[], y: Dimension<TRow>, x: Dimension<TRow>) => Cube<TRow>;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export declare const map: <TSource, TResult>(source: Matrix<TSource>, selector: Callback<TSource, TResult>) => Matrix<TResult>;
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
export declare const filter: <TRow>(predicate: Callback<TRow, boolean>) => Callback<TRow[], TRow[]>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export declare const select: <TRow, TResult>(selector: Callback<TRow, TResult>) => Callback<TRow[], TResult[]>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare const sum: <TRow>(selector: Callback<TRow, number>) => Callback<TRow[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export declare const average: <TRow>(selector: Callback<TRow, number>) => Callback<TRow[], number>;
