/**
 * @vitest-environment jsdom
 */

import store from 'scripts/store';
import { render } from '@testing-library/vue';
import AppRouter from 'scripts/containers/AppRouter.vue';

vi.mock('scripts/store/routes', () => ({
  default: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    '/': (): Any => Promise.resolve(require('scripts/pages/HomePage.vue').default),
  },
}));

describe('containers/AppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(console, { warn: vi.fn() });
  });

  test.skip('renders correctly - loading page', async () => {
    const { container } = render(AppRouter);
    expect(container.firstChild).toMatchSnapshot();
  });

  test.skip('renders correctly - page found', async () => {
    const { container } = render(AppRouter);
    store.mutate('router', 'NAVIGATE', '/');
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    expect(container.firstChild).toMatchSnapshot();
  });
});
