/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act } from 'react-dom/test-utils';
import TsButton from 'scripts/components/TsButton';
import { render, unmountComponentAtNode } from 'react-dom';

let container = document.createElement('div');

describe('react/TsButton', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    ((container as unknown) as null) = null;
  });

  test('renders correctly - basic', () => {
    act(() => {
      render(<TsButton label="Test" />, container);
    });
    expect(container).toMatchSnapshot();
  });
});
