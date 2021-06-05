/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** The type of keys used throughout the library. */
export declare type Key = string | number;
/** A set of attributes, each entry addressable via a key. */
export declare type Row<TValue, TKey extends Key> = {
    [T in TKey]: TValue;
};
/** A pair consiting of a key and value. */
export declare type Pair<TValue, TKey extends Key> = {
    key: TKey;
    value: TValue;
};
export declare type Axis<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<{
    predicate: Func<TRow, boolean>;
    criteria: Array<Pair<TValue, TKey>>;
}>;
/** A table of data. */
export declare type Table<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<Array<Table<TValue, TKey, TRow>>>;
