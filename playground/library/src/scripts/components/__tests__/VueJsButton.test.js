/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/vue';
import VueTsButton from 'scripts/components/VueJsButton.vue';

describe('vue/VueTsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const { container } = render(VueTsButton, {
      props: { label: 'Test' },
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
