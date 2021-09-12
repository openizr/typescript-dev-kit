/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import Message from 'scripts/components/Message.vue';

describe('vue/Message', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const wrapper = mount(Message, {
      propsData: { label: 'Test' },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
