/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import Loader from 'scripts/components/Loader.vue';

describe('vue/Loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const wrapper = mount(Loader, {
      propsData: {},
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
