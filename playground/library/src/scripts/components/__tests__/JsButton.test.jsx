import React from 'react';
import { act } from 'react-dom/test-utils';
import JsButton from 'scripts/components/JsButton';
import { render, unmountComponentAtNode } from 'react-dom';

let container = document.createElement('div');

describe('react/JsButton', () => {
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
      render(<JsButton label="Test" />, container);
    });
    expect(container).toMatchSnapshot();
  });
});
