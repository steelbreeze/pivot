import { Callback, Function, Predicate } from '@steelbreeze/types';
/** The type of values that can be in the source data. */
export declare type Value = any;
/** The type of keys supported. */
export declare type Key = string | number;
/** A predicate used to determine if source data is associated with a point of a dimension and its optional associated metadata. */
export declare type Criteria<TRecord, TMetadata> = Predicate<TRecord> & {
    metadata?: TMetadata;
};
/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export declare type Dimension<TRecord, TMetadata> = Array<Criteria<TRecord, TMetadata>>;
/** A matrix is a two-dimensional data structure. */
export declare type Matrix<TRecord> = Array<Array<TRecord>>;
/** A cube of data. */
export declare type Cube<TRecord> = Matrix<Array<TRecord>>;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param callback An optional callback to build the dimensions criteria for each of the values provided.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export declare const dimension: <TRecord extends Record<Key, any>, TMetadata>(key: Key, values: Array<Value>, callback?: Callback<any, Criteria<TRecord, TMetadata>>) => Dimension<TRecord, TMetadata>;
/**
 * Pivots a table by two axes
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export declare const cube: <TRecord, TMetadata>(source: TRecord[], y: Dimension<TRecord, TMetadata>, x: Dimension<TRecord, TMetadata>) => Cube<TRecord>;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data, a matrix of records.
 * @param callback A callback function to create a result from each cell of the cube.
 */
export declare const map: <TRecord, TResult>(source: Matrix<TRecord>, callback: Callback<TRecord, TResult>) => Matrix<TResult>;
/**
 * A generator, used to filter data within a cube.
 * @param callback A predicate to test source data to see if it should be included in the filter results.
 */
export declare const filter: <TRecord>(callback: Callback<TRecord, boolean>) => Function<TRecord[], TRecord[]>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param callback A function to transform a source record into the desired result.
 */
export declare const select: <TRecord, TResult>(callback: Callback<TRecord, TResult>) => Function<TRecord[], TResult[]>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export declare const sum: <TRecord>(callback: Function<TRecord, number>) => Function<TRecord[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export declare const average: <TRecord>(callback: Function<TRecord, number>) => Function<TRecord[], number>;
