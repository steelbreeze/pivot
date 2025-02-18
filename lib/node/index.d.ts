export type Function<TArg, TResult> = (arg: TArg) => TResult;
export type Predicate<TSource> = Function<TSource, boolean>;
export type Dimension<TSource> = Array<Predicate<TSource>>;
export type Matrix<TSource> = Array<Array<TSource>>;
export type Cube<TSource> = Matrix<Array<TSource>>;
export type Hypercube = Cube<Array<any>>;
export declare const dimension: <TDimension, TSource>(source: Array<TDimension>, generator: Function<TDimension, Predicate<TSource>>) => Dimension<TSource>;
export declare const property: <TSource>(key: keyof TSource) => Function<TSource[keyof TSource], Predicate<TSource>>;
export declare const pivot: {
    <TSource>(source: Array<TSource>, first: Dimension<TSource>): Matrix<TSource>;
    <TSource>(source: Array<TSource>, first: Dimension<TSource>, second: Dimension<TSource>): Cube<TSource>;
    <TSource>(source: Array<TSource>, first: Dimension<TSource>, ...others: Array<Dimension<TSource>>): Hypercube;
};
export declare const query: <TSource, TResult>(matrix: Matrix<TSource>, selector: Function<TSource, TResult>) => Matrix<TResult>;
export declare const sum: <TSource>(selector: Function<TSource, number>) => Function<Array<TSource>, number>;
export declare const average: <TSource>(selector: Function<TSource, number>) => Function<Array<TSource>, number>;
