/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** A pair consiting of a key and value. */
export declare type Pair<TValue> = {
    key: string | number;
    value: TValue;
};
/** A key and value of that key to use when slicing data in a pivot operation and the filter to evaluate it. */
export declare type Criterion<TRow, TValue> = {
    predicate: Func<TRow, boolean>;
} & Pair<TValue>;
/** A set of criterion representing a single dimension. */
export declare type Dimension<TRow, TValue> = Array<Criterion<TRow, TValue>>;
/** An axis on which to pivot source data; an axis is constructed from 1..n dimensions. */
export declare type Axis<TRow, TValue> = Array<Dimension<TRow, TValue>>;
/** A table of data. */
export declare type Table<TRow> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow> = Array<Array<Table<TRow>>>;
