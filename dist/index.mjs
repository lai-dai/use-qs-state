// src/use-query-string-state.ts
import { useCallback, useEffect, useState } from "react";
var RESET = "RESET";
function isNumber(num) {
  if (typeof num === "number") {
    return num - num === 0;
  }
  if (typeof num === "string" && num.trim() !== "") {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
}
function toNumberable(value) {
  if (Array.isArray(value)) {
    return value.map((item) => toNumberable(item));
  }
  switch (typeof value) {
    case "string":
      return isNumber(value) ? Number(value) : value;
    default:
      return value;
  }
}
function parseQueryString(searchParams) {
  const output = {};
  const urlParams = new URLSearchParams(searchParams);
  (/* @__PURE__ */ new Set([...urlParams.keys()])).forEach((key) => {
    output[key] = urlParams.getAll(key).length > 1 ? toNumberable(urlParams.getAll(key)) : toNumberable(urlParams.get(key));
  });
  return output;
}
function stringifyQueryString(obj) {
  return Object.entries(obj).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (item == void 0 || item == null)
          return;
        return encodeURIComponent(key) + "=" + encodeURIComponent(item);
      });
    }
    if (value == void 0 || value == null)
      return;
    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
  }).join("&");
}
function createQueryString() {
  return {
    parse: parseQueryString,
    stringify: stringifyQueryString
  };
}
function useQueryStringState(initialState, {
  onValueChange,
  onPathnameChange,
  queryString = createQueryString(),
  isSyncPathname = true
} = {}) {
  const getInitialStateWithQueryString = (initialState2) => {
    const url = new URL(window.location.href);
    for (const k of url.searchParams.keys()) {
      if (!(k in initialState2)) {
        url.searchParams.delete(k);
      }
    }
    const parsed = queryString.parse(url.searchParams.toString());
    return Object.assign({}, initialState2, parsed);
  };
  const [state, _setState] = useState(
    isSyncPathname ? getInitialStateWithQueryString(initialState) : initialState
  );
  const setState = (value) => {
    const payload = value === RESET ? initialState : value instanceof Function ? value(state) : value;
    _setState(payload);
    onValueChange?.(payload);
    const url = new URL(window.location.href);
    const parsed = queryString.parse(url.searchParams.toString());
    const searchParams = queryString.stringify(Object.assign(parsed, payload));
    const resultUrl = url.pathname + "?" + searchParams;
    window.history.pushState(null, "", resultUrl);
    onPathnameChange?.(resultUrl);
  };
  useEffect(() => {
    const handlePopState = () => {
      if (isSyncPathname) {
        _setState(getInitialStateWithQueryString(initialState));
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
export {
  useQueryStringState
};
//# sourceMappingURL=index.mjs.map