/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** The type of keys used to index the values. */
export declare type Key = string | number;
/** A table of data. */
export declare type Table<TRow> = TRow[];
/** A cube of data. */
export declare type Cube<TRow> = Table<TRow>[][];
/** A key and value of that key to use when slicing data in a pivot operation and the filter to evaluate it. */
export declare type Criterion<TRow, TValue> = {
    key: Key;
    value: TValue;
    f: Func<TRow, boolean>;
};
/** A set of criterion representing the citeria for a single dimension. */
export declare type Dimension<TRow, TValue> = Criterion<TRow, TValue>[];
/** The cartesean product of multiple dimensions, allowing a pivot to use multiple dimensions for each of the x and y axis. */
export declare type Axis<TRow, TValue> = Dimension<TRow, TValue>[];
/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 */
export declare function dimension<TRow, TValue>(table: Table<TRow>, key: Key, f?: Func<TRow, TValue>): Dimension<TRow, TValue>;
export declare namespace dimension {
    var make: <TRow, TValue>(source: TValue[], key: Key, f?: Func<TRow, TValue>) => Dimension<TRow, TValue>;
}
/**
 * Combines one of more dimensions into an axis, the axis is the cartesean product of all dimension values.
 * @param dimensions The set of dimensions to turn into an axis.
 */
export declare function axis<TRow, TValue>(...dimensions: Dimension<TRow, TValue>[]): Axis<TRow, TValue>;
/**
 * Pivots a table by 1..n axis
 * @param table The source data, an array of JavaScript objects.
 * @param axes 1..n Axis to pivot the table by.
 */
export declare function pivot<TRow, TValue>(table: Table<TRow>, ...axes: Axis<TRow, TValue>[]): any[];
/**
 * Selects data from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result for the table in each cell of the cube.
 */
export declare function query<TRow, TValue, TResult extends TValue>(cube: Cube<TRow>, f: Func<Table<TRow>, TResult>): Table<TResult[]>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export declare function count<TRow>(table: Table<TRow>): number | null;
/**
 * Sums numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function sum<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null>;
/**
 * Averages numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function average<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null>;
