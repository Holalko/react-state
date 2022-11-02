import { useEffect, useRef, useState } from "react";
import { deepEquals } from "./utils";

type DispatchActions<State, Actions> = {
  [K in keyof Actions]: Actions[K] extends (
    state: any,
    payload: infer Payload
  ) => any
    ? (payload: Payload) => void
    : never;
} & {
  init: (payload: State) => void;
};

const createDataApi = <State extends unknown>(defaultState: State) => {
  let state: State = defaultState;
  let listeners: (() => void)[] = [];

  const setState = (updater: ((state: State) => State) | State) => {
    if (typeof updater === "function") {
      state = (updater as (state: State) => State)(state as State);
    } else {
      state = updater;
    }
    listeners.forEach((listener) => listener());
  };

  const getState = () => state;

  const subscribe = (listener: () => void) => {
    listeners.push(listener);

    // immediately call the listener to get the latest state
    listener();
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  return {
    setState,
    getState,
    subscribe,
  };
};

type CreateStoreOptions<State, Actions> = {
  initialData: State;
  actions: Actions;
};
export const createStore = <
  State,
  Actions extends Record<string, (state: State, payload: any) => State>
>({
  initialData,
  actions,
}: CreateStoreOptions<State, Actions>) => {
  const api = createDataApi<State>(initialData);

  const init = (initState: State) => api.setState(initState);

  const dispatchActions = Object.entries(actions).reduce(
    (acc, action) => {
      const [key, fn] = action as [
        string,
        (state: State, payload: unknown) => State
      ];

      return {
        ...acc,
        [key]: (payload: Parameters<typeof fn>[1]) => {
          api.setState((prev) => fn(prev, payload));
        },
      };
    },
    { init } as DispatchActions<State, Actions>
  );

  function useStore<SelectorValue = State>(
    selector: (whole: State) => SelectorValue = (state) =>
      state as unknown as SelectorValue
  ) {
    const selectorRef = useRef(selector);
    useEffect(() => {
      selectorRef.current = selector;
    });

    const [state, setState] = useState<SelectorValue>(() =>
      selector(api.getState())
    );

    useEffect(() => {
      return api.subscribe(() => {
        setState((prev) => {
          const newState = selectorRef.current(api.getState());
          if (typeof prev !== "object") {
            return newState;
          }

          return deepEquals(prev, newState) ? prev : newState;
        });
      });
    }, []);

    return [state, dispatchActions] as const;
  }

  return useStore;
};
