/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import Home from 'scripts/pages/Home.vue';

describe('vue/Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const wrapper = mount(Home, {
      propsData: { translate: (label: string) => label },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
