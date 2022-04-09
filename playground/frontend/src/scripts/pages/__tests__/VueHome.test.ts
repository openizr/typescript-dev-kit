/**
 * @jest-environment jsdom
 */

import Home from 'scripts/pages/Home.vue';
import { render } from '@testing-library/vue';

describe('vue/Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const { container } = render(Home, { props: { translate: (label: string) => label } });
    expect(container.firstChild).toMatchSnapshot();
  });
});
