/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/vue';
import Message from 'scripts/components/Message.vue';

describe('vue/Message', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const { container } = render(Message, { props: { label: 'Test' } });
    expect(container.firstChild).toMatchSnapshot();
  });
});
