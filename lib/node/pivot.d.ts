import { Axis, Cube, Func, Key, Pair, Table } from './types';
/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 * @param s An optional callback function used to sort the values of the dimension, conforming to Array.prototype.sort.
 */
export declare function axis<TRow, TValue>(table: Table<TRow>, key: Key, f?: Func<TRow, TValue>, s?: (a: TValue, b: TValue) => number): Axis<TRow, Pair<TValue>>;
export declare namespace axis {
    var make: <TRow, TValue>(source: TValue[], key: string | number, f?: Func<TRow, TValue>) => Axis<TRow, Pair<TValue>>;
}
/**
 * Pivots a table by 1..n axis
 * @param table The source data, an array of JavaScript objects.
 * @param y The first axis to pivot the table by.
 * @param axes 0..n subsiquent axes to pivot the table by.
 */
export declare function pivot<TRow, TValue>(table: Table<TRow>, y: Axis<TRow, TValue>, x: Axis<TRow, TValue>): Cube<TRow>;
/**
 * Returns data queried from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result from each cell of the cube.
 */
export declare function query<TRow, TValue, TResult extends TValue>(cube: Cube<TRow>, f: Func<Table<TRow>, TResult>): Table<Array<TResult>>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export declare function count<TRow>(table: Table<TRow>): number | null;
/**
 *  generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function sum<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function average<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null>;
