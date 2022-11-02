# react-state

Simple library for managing state in React.

## Installation

```bash
npm install --save Holalko/react-state
```

## Usage

### Simple use case

```tsx
import { createStore } from "react-state";

type State = {
  counter: number;
  words: string[];
};

const initialState: State = {
  counter: 0,
  words: [],
};

const useMyStore = createStore({
  initialState,
  actions: {
    increment: (state: State) => {
      return {
        ...state,
        counter: state.counter + 1,
      };
    },
    changeCount: (state: State, count: number) => {
      return {
        ...state,
        counter: count,
      };
    },
    addWord: (state: State, word: string) => {
      return {
        ...state,
        words: [...state.words, word],
      };
    },
  },
});

const App = () => {
  const [{ counter, words }, { increment, changeCount, addWord }] =
    useMyStore();

  return (
    <div>
      <div>Counter: {counter}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={() => changeCount(10)}>Change count to 10</button>
      <button onClick={() => addWord("Hello")}>Add word</button>
      <div>Words: {words.join(", ")}</div>
    </div>
  );
};
```

### Optimize re-rendering

You can also use selectors to minimize re-renders:

```tsx
const CounterComponent = () => {
  const [counter] = useMyStore((state) => state.counter);

  return <div>Counter: {counter}</div>;
};

const CounterTimesTwoComponent = () => {
  const [counterTimesTwo] = useMyStore((state) => state.counter * 2);

  return <div>Counter times two: {counterTimesTwo}</div>;
};
```

This will only re-render when the counter changes.

### Init with async data

By default, each store comes with `init` function that can be used to initialize the store with any data.

```tsx
const useMyStore = createStore({
  initialState,
  actions: {},
});

const App = () => {
  const [{ counter, words }, { init }] = useMyStore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("https://example.com/data").then((res) =>
        res.json()
      );
      init(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>Counter: {counter}</div>
      <div>Words: {words.join(", ")}</div>
    </div>
  );
};
```

## Roadmap

- [ ] Support async actions

## License

So far none, but maybe some day if I won't be lazy enough to do it.
