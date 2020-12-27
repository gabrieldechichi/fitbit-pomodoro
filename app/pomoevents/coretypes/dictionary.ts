export type Dictionary<T extends string | symbol | number, U> = {
    [K in T]: U;
};