/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** A key and value of that key to use when slicing data in a pivot operation and the filter to evaluate it. */
export declare type Criterion<TRow, TValue> = {
    key: string | number;
    value: TValue;
    f: Func<TRow, boolean>;
};
/** A set of criterion representing a single dimension. */
export declare type Dimension<TRow, TValue> = Array<Criterion<TRow, TValue>>;
/** A cartesian product of multiple dimensions. */
export declare type Axis<TRow, TValue> = Array<Dimension<TRow, TValue>>;
/** A table of data. */
export declare type Table<TRow> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow> = Array<Array<Table<TRow>>>;
/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 * @param s An optional callback function used to sort the values of the dimension, conforming to Array.prototype.sort.
 */
export declare function dimension<TRow, TValue>(table: Table<TRow>, key: string | number, f?: Func<TRow, TValue>, s?: (a: TValue, b: TValue) => number): Dimension<TRow, TValue>;
export declare namespace dimension {
    var make: <TRow, TValue>(source: TValue[], key: string | number, f?: Func<TRow, TValue>) => Dimension<TRow, TValue>;
}
/**
 * Combines one of more dimensions into an axis, the axis is the cartesian product of all dimension values.
 * @param dimensions The set of dimensions to turn into an axis.
 */
export declare function axis<TRow, TValue>(...dimensions: Array<Dimension<TRow, TValue>>): Axis<TRow, TValue>;
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
