import { mount } from '@vue/test-utils';
import store from 'scripts/store/index';
import RouterJS from 'scripts/containers/RouterJS.vue';

// Useful mocks allowing us to easily test Vue lazy components.
jest.mock('scripts/store/routes', () => ({
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  '/': require('scripts/pages/Home.vue').default,
}));

describe('vue/RouterJS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly - loading page', () => {
    const wrapper = mount(RouterJS, {
      propsData: { locale: { LABEL_TEST: 'Test' } },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('renders correctly - page found', (done) => {
    store.mutate('router', 'NAVIGATE', '/');
    const wrapper = mount(RouterJS, {
      propsData: { locale: { LABEL_TEST: 'Test' } },
    });
    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  test('renders correctly - page not found', (done) => {
    store.mutate('router', 'NAVIGATE', '/404');
    const wrapper = mount(RouterJS, {
      propsData: { locale: { LABEL_TEST: 'Test' } },
    });
    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });
});
