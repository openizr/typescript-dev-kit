import store from 'scripts/store/index';
import {
  ref,
  UnwrapRef,
  onMounted,
  onUnmounted,
} from 'vue';

const privateStore = (store as Any);
const getState = (moduleHash: string): Any => privateStore.modules[moduleHash].state;

export default (hash: string, reducer = (newState: Any): Any => newState): void => {
  const combiner = privateStore.combiners[hash];

  if (combiner !== undefined) {
    let subscriptionId: string;
    const state = ref(reducer(combiner.reducer(
      ...combiner.modulesHashes.map(getState),
    )));
    // Subscribing to the given combiner at component creation...
    onMounted(() => {
      subscriptionId = store.subscribe<Any>(hash, (newState) => {
        state.value = reducer(newState) as UnwrapRef<Any>;
      });
    });
    onUnmounted(() => {
      store.unsubscribe(hash, subscriptionId);
    });
    return state;
  }
  throw new Error(`Could not use combiner "${hash}": combiner does not exist.`);
};
