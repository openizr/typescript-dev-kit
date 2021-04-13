import { mount } from '@vue/test-utils';
import VueTsButton from 'scripts/components/VueTsButton.vue';

describe('vue/VueTsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - basic', () => {
    const wrapper = mount(VueTsButton, {
      propsData: { label: 'Test' },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
