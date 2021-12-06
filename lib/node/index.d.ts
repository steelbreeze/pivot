import { Function, Predicate, Pair } from './types';
/** The type of keys supported. */
export declare type Key = string | number;
/** A criterion used in the criteria of a dimension. */
export interface Criterion<TRow> extends Pair {
    /** The predicate used to perform the test. */
    predicate: Predicate<TRow>;
}
/** The set of criterion used to select items for a row or column within a cube. */
export declare type Criteria<TRow> = Array<Criterion<TRow>>;
/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export declare type Dimension<TRow> = Array<Criteria<TRow>>;
/** A pair of axes to be used in a pivot operation. */
export interface Axes<TRow> {
    /** The x axis; columns in the resultant pivot table. */
    x: Dimension<TRow>;
    /** The y axis; rows in the resultant pivot table. */
    y: Dimension<TRow>;
}
/** A cube of data. */
export declare type Cube<TValue> = Array<Array<Array<TValue>>>;
/**
 * Function to pass into Array.prototype.filter to return only unique values.
 */
export declare const unique: <TValue>(value: TValue, index: number, array: TValue[]) => boolean;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
export declare const distinct: <TRow extends Record<Key, any>>(table: TRow[], key: Key, getValue?: Function<TRow, any>) => Array<any>;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getCriteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export declare const dimension: <TRow extends Record<Key, any>>(values: Array<any>, key: Key, getCriteria?: Function<any, Criteria<TRow>>) => Dimension<TRow>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export declare const cube: <TRow>(table: TRow[], axes: Axes<TRow>) => Cube<TRow>;
/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @param dimension The dimension to generate the slicer for.
 * @returns Returns a function that will take a table and slice it into an array of tables each conforming to the criteria of a point on a dimension.
  */
export declare const slice: <TValue>(dimension: Dimension<TValue>) => Function<TValue[], TValue[][]>;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export declare const map: <TRow, TResult>(source: Cube<TRow>, selector: Function<TRow[], TResult>) => TResult[][];
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
export declare const filter: <TRow>(predicate: Predicate<TRow>) => Function<TRow[], TRow[]>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export declare const select: <TRow, TResult>(selector: Function<TRow, TResult>) => Function<TRow[], TResult[]>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare const sum: <TRow>(selector: Function<TRow, number>) => Function<TRow[], number | null>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare const average: <TRow>(selector: Function<TRow, number>) => Function<TRow[], number | null>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export declare const count: <TRow>(table: TRow[]) => number | null;
