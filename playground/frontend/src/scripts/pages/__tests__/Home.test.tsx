/**
 * @jest-environment jsdom
 */

import React from 'react';
import Home from 'scripts/pages/Home';
import { render } from '@testing-library/react';

describe('react/Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const { container } = render(<Home translate={(label: string): string => label} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
