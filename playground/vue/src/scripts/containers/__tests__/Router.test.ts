import { mount } from '@vue/test-utils';
import store from 'scripts/store/index';
import Router from 'scripts/containers/Router.vue';

// Useful mocks allowing us to easily test Vue lazy components.
jest.mock('scripts/store/routes', () => ({
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  '/': require('scripts/pages/Home.vue').default,
}));

describe('vue/Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - loading page', () => {
    const wrapper = mount(Router, {
      propsData: { locale: { LABEL_TEST: 'Test' } },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('renders correctly - page found', async () => {
    store.mutate('router', 'NAVIGATE', '/');
    const wrapper = mount(Router, {
      propsData: { locale: { LABEL_TEST: 'Test' } },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('renders correctly - page not found', async () => {
    store.mutate('router', 'NAVIGATE', '/404');
    const wrapper = mount(Router, {
      propsData: { locale: { LABEL_TEST: 'Test' } },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
