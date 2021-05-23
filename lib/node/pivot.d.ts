export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
export declare type Value = any;
export declare type Key = string | number;
export declare type Row = {
    [TKey in Key]: Value;
};
export declare type Criterion<TRow extends Row> = {
    name: Key;
    f: Func<TRow, Value>;
    value: Value;
};
export declare type Dimension<TRow extends Row> = Criterion<TRow>[];
export declare type Axis<TRow extends Row> = Dimension<TRow>[];
export declare type Table<TRow extends Row> = TRow[];
export declare type Cube<TRow extends Row> = Table<TRow>[][];
/**
 * Creates a dimension for a given column in a table; a dimension is a name and a set of unique values provided by a function.
 * @param source The source data, an array of objects.
 * @param name The name to give this dimension.
 * @param f An optional callback function to derive values from the source objects. If omitted, the attribute with the same name as the name parameter passed.
 * @param s An optional callback function used to determine the order of the dimension. Functions in exacly the same way as Array.prototype.sort's compareFn.
 * @remarks This data structure can be useful in populating lists for filters.
 */
export declare function dimension<TRow extends Row>(source: Table<TRow>, name: string, f?: Func<TRow, any>, s?: (a: Value, b: Value) => number): Dimension<TRow>;
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
export declare function select<TRow extends Row, TResult extends Value>(cube: Cube<TRow>, f: Func<Table<TRow>, TResult>): Table<Row>;
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
