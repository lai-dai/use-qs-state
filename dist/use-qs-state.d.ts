type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;
interface QueryString {
    parse: (str: string) => Record<string, any>;
    stringify: (obj: Record<string, any>) => string;
}
interface UseQSStateOptions<S extends object> {
    onValueChange?: (value: S) => void;
    onPathnameChange?: (pathname: string) => void;
    queryString?: QueryString;
    isSyncPathname?: boolean;
}
declare function useQSState<S extends object>(initialState: Readonly<S>, { onValueChange, onPathnameChange, queryString, isSyncPathname, }?: UseQSStateOptions<S>): [S, Dispatch<SetStateAction<S>>];

export { QueryString, UseQSStateOptions, useQSState };
