/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
export declare type Predicate<TArg> = Func<TArg, boolean>;
export declare type Key = string | number;
/** A pair consiting of a key and value. */
export declare type Pair<TValue> = {
    key: Key;
    value: TValue;
};
export declare type Axis<TRow, TMeta> = Array<{
    predicate: Predicate<TRow>;
    meta: TMeta;
}>;
/** A table of data. */
export declare type Table<TRow> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow> = Array<Array<Table<TRow>>>;
