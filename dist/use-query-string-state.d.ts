type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;
interface QueryString {
    parse: (str: string) => Record<string, any>;
    stringify: (obj: Record<string, any>) => string;
}
interface UseQueryStringStateOptions<S extends object> {
    onValueChange?: (value: S) => void;
    onPathnameChange?: (pathname: string) => void;
    queryString?: QueryString;
    isSyncPathname?: boolean;
}
declare function useQueryStringState<S extends object>(initialValue: Readonly<S>, { onValueChange, onPathnameChange, queryString, isSyncPathname, }?: UseQueryStringStateOptions<S>): [S, Dispatch<SetStateAction<S>>, Function];

export { QueryString, UseQueryStringStateOptions, useQueryStringState };
