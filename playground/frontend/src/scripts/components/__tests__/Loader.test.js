/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/vue';
import Loader from 'scripts/components/Loader.vue';

describe('vue/Loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const { container } = render(Loader);
    expect(container.firstChild).toMatchSnapshot();
  });
});
