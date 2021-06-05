/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** A function taking one argument and returning a boolean result. */
export declare type Predicate<TArg> = Func<TArg, boolean>;
/** The type of keys used throughout the library. */
export declare type Key = string | number;
export declare type Row<TValue, TKey extends Key> = {
    [T in TKey]: TValue;
};
/** A pair consiting of a key and value. */
export declare type Pair<TValue, TKey extends Key> = {
    key: TKey;
    value: TValue;
};
export declare type Axis<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<{
    predicate: Predicate<TRow>;
    meta: Array<Pair<TValue, TKey>>;
}>;
/** A table of data. */
export declare type Table<TRow> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow> = Array<Array<Table<TRow>>>;
