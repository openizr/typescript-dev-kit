/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import store from 'scripts/store/index';
import Router from 'scripts/containers/Router';
import { render } from '@testing-library/react';

type Misc = any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Useful mocks allowing us to easily test React lazy components and Suspense.
jest.mock('react', () => {
  const MockedReact = jest.requireActual('react');
  MockedReact.Suspense = ({ children, fallback }: Misc): Misc => (
    process.env.LOADING === 'true' ? fallback : children
  );
  MockedReact.lazy = (callback: Misc): Misc => callback();
  return MockedReact;
});

jest.mock('scripts/store/routes', () => ({
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  '/': (): Misc => require('scripts/pages/Home').default,
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  '/js': (): Misc => require('scripts/pages/HomeJS').default,
}));

describe('react/Router', () => {
  beforeEach(() => {
    process.env.LOADING = 'false';
    jest.clearAllMocks();
  });

  test('renders correctly - loading page', () => {
    process.env.LOADING = 'true';
    const { container } = render(<Router locale={{ LABEL_TEST: 'Test' }} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders correctly - found page', () => {
    store.mutate('router', 'NAVIGATE', '/');
    const { container } = render(<Router locale={{ LABEL_TEST: 'Test' }} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders correctly - not found page', () => {
    store.mutate('router', 'NAVIGATE', '/404');
    const { container } = render(<Router locale={{ LABEL_TEST: 'Test' }} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
