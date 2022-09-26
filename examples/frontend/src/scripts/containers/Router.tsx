import store from 'scripts/store';
import * as React from 'react';
import routes from 'scripts/store/routes';
import useStore from 'diox/connectors/react';
import Loader from 'scripts/components/Loader';
import translate from 'scripts/helpers/translate';

type LazyComponent = () => Promise<{
  default: React.ComponentType<{
    translate: (label: string, values: Record<string, string>) => string
  }>
}>;

const useCombiner = useStore(store); // eslint-disable-line react-hooks/rules-of-hooks

/**
 * App router.
 */
export default function Router(): JSX.Element {
  const route = useCombiner('router', (newState: { route: string; }) => newState.route);

  let currentPage = null;
  if (routes[route] !== undefined) {
    const Component = React.lazy(routes[route] as LazyComponent) as JSXElement;
    currentPage = <Component translate={translate} />;
  }

  const Suspense = React.Suspense as JSXElement;

  return (
    <Suspense fallback={<Loader /> as JSXElement}>
      {currentPage}
    </Suspense>
  );
}

Router.propTypes = {};
Router.defaultProps = {};
Router.displayName = 'Router';
