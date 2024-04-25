# useQSState

## how to use this

1. install dependencies

```
npm i github:lai-dai/use-query-string-state
```

2. use

```js
import { useQueryStringState } from "@lai-dai/use-query-string-state";

const [state, setState, reset] = useQSState({
  text: "hello world",
  count: 1,
});
```
