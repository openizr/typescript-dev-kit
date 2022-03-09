/**
 * @jest-environment jsdom
 */

import React from 'react';
import HomeJS from 'scripts/pages/HomeJS';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from 'react-dom';

let container = document.createElement('div');

describe('react/HomeJS', () => {
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

  test('renders correctly - basic', () => {
    act(() => {
      render(<HomeJS translate={(label) => label} />, container);
    });
    expect(container).toMatchSnapshot();
  });
});
