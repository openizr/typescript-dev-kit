/**
 * @jest-environment jsdom
 */

import React from 'react';
import store from 'scripts/store/index';
import { act } from 'react-dom/test-utils';
import RouterJS from 'scripts/containers/RouterJS';
import { render, unmountComponentAtNode } from 'react-dom';

let container = document.createElement('div');

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
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  test('renders correctly - loading page', () => {
    act(() => {
      render(<RouterJS locale={{ LABEL_TEST: 'Test' }} />, container);
    });
    expect(container).toMatchSnapshot();
  });

  test('renders correctly - found page', () => {
    store.mutate('router', 'NAVIGATE', '/js');
    act(() => {
      render(<RouterJS locale={{ LABEL_TEST: 'Test' }} />, container);
    });
    expect(container).toMatchSnapshot();
  });

  test('renders correctly - not found page', () => {
    act(() => {
      store.mutate('router', 'NAVIGATE', '/404');
      render(<RouterJS locale={{ LABEL_TEST: 'Test' }} />, container);
    });
    expect(container).toMatchSnapshot();
  });
});
