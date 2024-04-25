import { useCallback, useEffect, useState } from "react";

type SetStateAction<S> = S | ((prevState: S) => S);

type Dispatch<A> = (value: A) => void;

const RESET = "RESET";

export interface QueryString {
  parse: (str: string) => Record<string, any>;
  stringify: (obj: Record<string, any>) => string;
}

export interface UseQueryStringStateOptions<S extends object> {
  onValueChange?: (value: S) => void;
  onPathnameChange?: (pathname: string) => void;
  queryString?: QueryString;
  isSyncPathname?: boolean;
}

function isNumber(num: any) {
  if (typeof num === "number") {
    return num - num === 0;
  }
  if (typeof num === "string" && num.trim() !== "") {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
}

function toNumberable(value: any): any {
  if (Array.isArray(value)) {
    return value.map((item: any) => toNumberable(item));
  }
  switch (typeof value) {
    case "string":
      return isNumber(value) ? Number(value) : value;

    default:
      return value;
  }
}

function parseQueryString<Value>(searchParams: string, initialValue: Value) {
  const output: Record<string, any> = {};
  const urlParams = new URLSearchParams(searchParams);

  // Set will return only unique keys()
  new Set([...urlParams.keys()]).forEach((key) => {
    output[key] =
      urlParams.getAll(key).length > 1
        ? urlParams.getAll(key)
        : initialValue instanceof Object &&
          key in initialValue &&
          typeof initialValue[key as keyof typeof initialValue] === "number"
        ? toNumberable(urlParams.get(key))
        : urlParams.get(key);
  });

  return output;
}

function stringifyQueryString(obj: Record<string, any>) {
  return Object.entries(obj)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => {
          if (item == undefined || item == null) return;
          return encodeURIComponent(key) + "=" + encodeURIComponent(item);
        });
      }
      if (value == undefined || value == null) return;
      return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    })
    .join("&");
}

function createQueryString<Value>(initialValue: Value): QueryString {
  return {
    parse: (searchParams) =>
      parseQueryString<Value>(searchParams, initialValue),
    stringify: stringifyQueryString,
  };
}

export function useQueryStringState<S extends object>(
  initialState: Readonly<S>,
  {
    onValueChange,
    onPathnameChange,
    queryString = createQueryString<S>(initialState),
    isSyncPathname = true,
  }: UseQueryStringStateOptions<S> = {}
): [S, Dispatch<SetStateAction<S>>, Function] {
  const getInitialStateWithQueryString = <S extends object>(
    initialState: Readonly<S>
  ) => {
    const url = new URL(window.location.href);

    for (const k of url.searchParams.keys()) {
      if (!(k in initialState)) {
        url.searchParams.delete(k);
      }
    }
    const parsed = queryString.parse(url.searchParams.toString());

    return Object.assign({}, initialState, parsed);
  };

  const [state, _setState] = useState<S>(
    isSyncPathname
      ? getInitialStateWithQueryString<S>(initialState)
      : initialState
  );

  const setState: Dispatch<SetStateAction<S> | typeof RESET> = (value) => {
    const payload =
      value === RESET
        ? initialState
        : value instanceof Function
        ? value(state)
        : value;

    _setState(payload);
    onValueChange?.(payload);

    const url = new URL(window.location.href);
    const parsed = queryString.parse(url.searchParams.toString());
    const searchParams = queryString.stringify(Object.assign(parsed, payload));

    const resultUrl = url.pathname + "?" + searchParams;

    if (onPathnameChange instanceof Function) {
      onPathnameChange(resultUrl);
    } else {
      window.history.pushState(null, "", resultUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (isSyncPathname) {
        _setState(getInitialStateWithQueryString<S>(initialState));
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isSyncPathname, initialState]);

  const reset = useCallback(
    () => () => {
      setState(RESET);
    },
    []
  );

  return [state, setState, reset];
}
