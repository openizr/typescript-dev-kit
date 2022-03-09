/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import Loader from 'scripts/components/Loader';
import { render } from '@testing-library/react';

describe('react/Loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toMatchSnapshot();
  });
});