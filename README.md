# npm-package-template-tsup

## how to use this

1. install dependencies

```
npm i github:lai-dai/use-qs-state
```

2. use

```js
const [state, setState] = useQSState(
  {
    text: "hello world",
    count: 1,
  },
  {
    onPathnameChange(url) {
      window.history.pushState(null, "", url);
    },
  }
);
```
