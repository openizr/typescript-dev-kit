import React from 'react';
import store from 'scripts/store/index';
import { act } from 'react-dom/test-utils';
import Router from 'scripts/containers/Router';
import { render, unmountComponentAtNode } from 'react-dom';

type Misc = any; // eslint-disable-line @typescript-eslint/no-explicit-any
let container = document.createElement('div');

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
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    ((container as unknown) as null) = null;
  });

  test('renders correctly - loading page', () => {
    process.env.LOADING = 'true';
    act(() => {
      render(<Router locale={{ LABEL_TEST: 'Test' }} />, container);
    });
    expect(container).toMatchSnapshot();
  });

  test('renders correctly - found page', () => {
    store.mutate('router', 'NAVIGATE', '/');
    act(() => {
      render(<Router locale={{ LABEL_TEST: 'Test' }} />, container);
    });
    expect(container).toMatchSnapshot();
  });

  test('renders correctly - not found page', () => {
    store.mutate('router', 'NAVIGATE', '/404');
    act(() => {
      render(<Router locale={{ LABEL_TEST: 'Test' }} />, container);
    });
    expect(container).toMatchSnapshot();
  });
});
