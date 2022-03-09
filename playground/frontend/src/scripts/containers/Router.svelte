<script lang="ts">
  import { onDestroy } from 'svelte';
  import * as routes from 'scripts/store/routes';
  import useCombiner from 'scripts/store/useCombiner';
  import Loader from 'scripts/components/Loader.svelte';

  let component: Any = { default: Loader };
  type Any = any; // eslint-disable-line
  export let locale: Record<string, string>;
  const router = useCombiner<Any>('router', (newState: Any) => newState);
  const unsubscribe = router.subscribe(async (newState) => {
    if ((routes as Any)[newState.route]) {
      component = await (routes as Any)[newState.route]();
    } else {
      component = null;
    }
  });
  onDestroy(unsubscribe);
</script>

{#if component !== null}
  <svelte:component this={component.default} {locale} />
{/if}
