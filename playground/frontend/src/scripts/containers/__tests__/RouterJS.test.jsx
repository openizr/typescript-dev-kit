/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import store from 'scripts/store/index';
import RouterJS from 'scripts/containers/RouterJS';
import { render } from '@testing-library/react';

// Useful mocks allowing us to easily test React lazy components and Suspense.
jest.mock('react', () => {
  const MockedReact = jest.requireActual('react');
  MockedReact.Suspense = ({ children, fallback }) => (
    process.env.LOADING === 'true' ? fallback : children
  );
  MockedReact.lazy = (callback) => callback();
  return MockedReact;
});

jest.mock('scripts/store/routes', () => ({
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  '/': () => require('scripts/pages/Home').default,
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  '/js': () => require('scripts/pages/HomeJS').default,
}));

describe('react/RouterJS', () => {
  beforeEach(() => {
    process.env.LOADING = 'false';
    jest.clearAllMocks();
  });

  test('renders correctly - loading page', () => {
    process.env.LOADING = 'true';
    const { container } = render(<RouterJS locale={{ LABEL_TEST: 'Test' }} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders correctly - found page', () => {
    store.mutate('router', 'NAVIGATE', '/');
    const { container } = render(<RouterJS locale={{ LABEL_TEST: 'Test' }} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders correctly - not found page', () => {
    store.mutate('router', 'NAVIGATE', '/404');
    const { container } = render(<RouterJS locale={{ LABEL_TEST: 'Test' }} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
