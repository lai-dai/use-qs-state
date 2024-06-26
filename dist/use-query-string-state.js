"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-query-string-state.ts
var use_query_string_state_exports = {};
__export(use_query_string_state_exports, {
  useQueryStringState: () => useQueryStringState
});
module.exports = __toCommonJS(use_query_string_state_exports);
var import_react = require("react");
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
function parseQueryString(searchParams, initialValue) {
  const output = {};
  const urlParams = new URLSearchParams(searchParams);
  (/* @__PURE__ */ new Set([...urlParams.keys()])).forEach((key) => {
    output[key] = urlParams.getAll(key).length > 1 ? urlParams.getAll(key) : initialValue instanceof Object && key in initialValue && typeof initialValue[key] === "number" ? toNumberable(urlParams.get(key)) : urlParams.get(key);
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
function createQueryString(initialValue) {
  return {
    parse: (searchParams) => parseQueryString(searchParams, initialValue),
    stringify: stringifyQueryString
  };
}
function useQueryStringState(initialValue, {
  onValueChange,
  onPathnameChange,
  queryString = createQueryString(initialValue),
  isSyncPathname = true
} = {}) {
  const getInitialStateWithQueryString = (initialValue2) => {
    try {
      if (typeof window !== "undefined" && isValidUrl(window.location.href)) {
        const url = new URL(window.location.href);
        for (const k of url.searchParams.keys()) {
          if (!(k in initialValue2)) {
            url.searchParams.delete(k);
          }
        }
        const urlParsed = queryString.parse(url.searchParams.toString());
        return Object.assign({}, initialValue2, urlParsed);
      }
      return initialValue2;
    } catch (error) {
      console.error(error);
      return initialValue2;
    }
  };
  const [state, _setState] = (0, import_react.useState)(
    isSyncPathname ? getInitialStateWithQueryString(initialValue) : initialValue
  );
  const setState = (value) => {
    const payload = value === RESET ? initialValue : value instanceof Function ? value(state) : value;
    _setState(payload);
    onValueChange?.(payload);
    if (typeof window !== "undefined" && isValidUrl(window.location.href)) {
      const url = new URL(window.location.href);
      const parsed = queryString.parse(url.searchParams.toString());
      const searchParams = queryString.stringify(
        Object.assign(parsed, payload)
      );
      const resultUrl = url.pathname + "?" + searchParams;
      if (onPathnameChange instanceof Function) {
        onPathnameChange(resultUrl);
      } else {
        window.history.pushState(null, "", resultUrl);
      }
    }
  };
  (0, import_react.useEffect)(() => {
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      const handlePopState = () => {
        if (isSyncPathname) {
          _setState(getInitialStateWithQueryString(initialValue));
        }
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isSyncPathname, initialValue]);
  const reset = (0, import_react.useCallback)(
    () => () => {
      setState(RESET);
    },
    []
  );
  return [state, setState, reset];
}
function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useQueryStringState
});
//# sourceMappingURL=use-query-string-state.js.map