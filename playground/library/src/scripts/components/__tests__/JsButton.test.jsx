/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import JsButton from 'scripts/components/JsButton';

describe('react/JsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const { container } = render(<JsButton label="Test" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
