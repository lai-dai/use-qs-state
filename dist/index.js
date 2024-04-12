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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useQSState: () => useQSState
});
module.exports = __toCommonJS(src_exports);

// src/use-qs-state.ts
var import_react = require("react");
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
function useQSState(initialState, {
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
  const [state, _setState] = (0, import_react.useState)(
    isSyncPathname ? getInitialStateWithQueryString(initialState) : initialState
  );
  const setState = (value) => {
    const payload = value instanceof Function ? value(state) : value;
    _setState(payload);
    const url = new URL(window.location.href);
    const parsed = queryString.parse(url.searchParams.toString());
    const searchParams = queryString.stringify(Object.assign(parsed, payload));
    onValueChange?.(payload);
    onPathnameChange?.(url.pathname + "?" + searchParams);
  };
  const handlePopState = () => {
    if (isSyncPathname) {
      _setState(getInitialStateWithQueryString(initialState));
    }
  };
  (0, import_react.useEffect)(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  return [state, setState];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useQSState
});
//# sourceMappingURL=index.js.map