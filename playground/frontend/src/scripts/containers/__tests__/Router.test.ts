/**
 * @jest-environment jsdom
 */

import store from 'scripts/store/index';
import { render, waitFor } from '@testing-library/vue';
import Router from 'scripts/containers/Router.vue';

// Useful mocks allowing us to easily test Vue lazy components.
jest.mock('scripts/store/routes', () => ({
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  '/': require('scripts/pages/Home.vue').default,
}));

describe('vue/Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - loading page', () => {
    const { container } = render(Router, { props: { locale: { LABEL_TEST: 'Test' } } });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders correctly - page found', async () => {
    store.mutate('router', 'NAVIGATE', '/');
    const { container } = render(Router, { props: { locale: { LABEL_TEST: 'Test' } } });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders correctly - page not found', async () => {
    store.mutate('router', 'NAVIGATE', '/404');
    await waitFor(() => new Promise((resolve) => {
      setTimeout(resolve, 50);
    }));
    const { container } = render(Router, { props: { locale: { LABEL_TEST: 'Test' } } });
    expect(container.firstChild).toMatchSnapshot();
  });
});
