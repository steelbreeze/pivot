/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** A function taking one argument and returning a boolean result. */
export declare type Predicate<TArg> = Func<TArg, boolean>;
export declare type Key = string | number;
/** A pair consiting of a key and value. */
export declare type Pair<TValue, TKey extends Key> = {
    key: TKey;
    value: TValue;
};
export declare type Axis<TRow, TMeta = any> = Array<{
    predicate: Predicate<TRow>;
    meta: TMeta;
}>;
/** A table of data. */
export declare type Table<TRow> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow> = Array<Array<Table<TRow>>>;
