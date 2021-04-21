/**
 * Fastify mock.
 */
const addHook = jest.fn((_event, callback) => callback(null, {
  header: jest.fn(),
}, null, jest.fn()));

const setValidatorCompiler = jest.fn((callback) => callback({ schema: {} }));

const register = jest.fn((callback) => callback({
  post: jest.fn(),
  get: jest.fn(),
}, null, jest.fn()));

const listen = jest.fn((_a, _b, callback) => callback(
  (process.env.ENV === 'production')
    ? 'error'
    : undefined,
));

const fastify = jest.fn(() => ({
  addHook,
  register,
  listen,
  setValidatorCompiler,
  log: { fatal: jest.fn() },
}));

export {
  fastify,
  addHook,
  register,
  listen,
  setValidatorCompiler,
};
export default fastify;
