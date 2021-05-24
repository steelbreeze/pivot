/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** The type of keys used to index the source data. */
export declare type Key = string | number;
/** A single data point. */
export declare type Value = any;
/** A row of data that is indexed by a key. */
export declare type Row = {
    [TKey in Key]: Value;
};
/** A table of data. */
export declare type Table<TRow extends Row> = TRow[];
/** A cube of data. */
export declare type Cube<TRow extends Row> = Table<TRow>[][];
/** A key and value of that key to use when slicing data in a pivot operation and the filter to evaluate it. */
export declare type Criterion<TRow extends Row> = {
    key: Key;
    value: Value;
    filter: Func<TRow, boolean>;
};
/** A set of criterion representing the citeria for a single dimension. */
export declare type Dimension<TRow extends Row> = Criterion<TRow>[];
/** The cartesean product of multiple dimensions, allowing a pivot to use multiple dimensions for each of the x and y axis. */
export declare type Axis<TRow extends Row> = Dimension<TRow>[];
/**
 * Creates a dimension for a given column in a table; a dimension is a key and a set of unique values provided by a function.
 * @param table The source data, an array of objects.
 * @param key The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same key as the key parameter passed.
 * @remarks This data structure can be useful in populating lists for filters.
 */
export declare function dimension<TRow extends Row>(table: Table<TRow>, key: string, f?: Func<TRow, any>): Dimension<TRow>;
export declare namespace dimension {
    var make: <TRow extends Row>(source: any[], key: string, f?: Func<TRow, any>) => Dimension<TRow>;
}
/**
 * Combines one of more dimensions into an axis, the axis is the cartesean product of all dimension values.
 * @param dimensions The set of dimensions to turn into an axis.
 * @remarks The data structure can be useful in drawing axis in resultant tables.
 */
export declare function axis<TRow extends Row>(...dimensions: Dimension<TRow>[]): Axis<TRow>;
/**
 * Pivots a table by the x (rows) any z (columns) axis
 * @param table The source data, an array of JavaScript objects.
 * @param x The x axis, the result of a call to axis with one or more dimensions.
 * @param y The y axis, the result of a call to axis with one or more dimensions.
 * @remarks Should you need to pivot by more than two axes, simpley extend this method, slicing by each additional axis.
 */
export declare function pivot<TRow extends Row>(table: Table<TRow>, x: Axis<TRow>, y: Axis<TRow>): Cube<TRow>;
/**
 * Selects data from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result for the table in each cell of the cube.
 */
export declare function query<TRow extends Row, TResult extends Value>(cube: Cube<TRow>, f: Func<Table<TRow>, TResult>): Table<Row>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 * @remarks Null is returned where the table is empty as this represents the absense of values.
 */
export declare function count<TRow extends Row>(table: Table<TRow>): number | null;
/**
 * Sums numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function sum<TRow>(f: Func<TRow, number>): Func<Table<TRow>, number | null>;
/**
 * Averages numerical values derived from rows in a table.
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function average<TRow extends Row>(f: Func<TRow, number>): Func<Table<TRow>, number | null>;
