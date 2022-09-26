/**
 * Fastify mock.
 */
const addHook = vi.fn((_event, callback) => callback(null, {
  header: vi.fn(),
}, null, vi.fn()));

const setValidatorCompiler = vi.fn((callback) => callback({ schema: {} }));

const register = vi.fn((callback) => callback({
  post: vi.fn(),
  get: vi.fn(),
}, null, vi.fn()));

const listen = vi.fn((_a, callback) => callback(
  (process.env.ENV === 'production')
    ? 'error'
    : undefined,
));

const fastify = vi.fn(() => ({
  addHook,
  register,
  listen,
  setValidatorCompiler,
  log: { fatal: vi.fn() },
}));

export {
  fastify,
  addHook,
  register,
  listen,
  setValidatorCompiler,
};
export default fastify;
