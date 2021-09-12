import { i18n } from 'basx';
import store from 'scripts/store';
import React, { Suspense } from 'react';
import routes from 'scripts/store/routes';
import useStore from 'diox/connectors/react';
import Loader from 'scripts/components/Loader';
import PropTypes, { InferProps } from 'prop-types';

type LazyComponent = () => Promise<{
  default: React.ComponentType<{
    translate: (label: string, values: Record<string, string>) => string
  }>
}>;

const [useCombiner] = useStore(store);

const propTypes = {
  locale: PropTypes.instanceOf(Object).isRequired,
};

/**
 * App router.
 */
export default function Router(props: InferProps<typeof propTypes>): JSX.Element {
  const { locale } = props;
  const [route] = useCombiner('router', (newState: { route: string; }) => newState.route);

  let currentPage = null;
  if (routes[route] !== undefined) {
    const Component = React.lazy(routes[route] as LazyComponent);
    currentPage = <Component translate={i18n(locale as Record<string, string>)} />;
  }

  return (
    <Suspense fallback={<Loader />}>
      {currentPage}
    </Suspense>
  );
}

Router.propTypes = propTypes;
Router.defaultProps = {};
Router.displayName = 'Router';
