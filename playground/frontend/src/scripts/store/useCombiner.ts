import store from 'scripts/store';
import { readable, Readable } from 'svelte/store/index';

export default function useCombiner<T>(hash: string, reducer: JSXElement): Readable<T> {
  return readable({} as JSXElement, (set) => {
    const listener = store.subscribe(hash, (newState) => {
      set(reducer(newState));
    });
    return () => {
      store.unsubscribe(hash, listener);
    };
  });
}
