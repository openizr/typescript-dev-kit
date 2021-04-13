/**
 * Fastify mock.
 */
const addHook = jest.fn((_event, callback) => callback(null, {
  header: jest.fn(),
}, null, jest.fn()));

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
  log: { fatal: jest.fn() },
}));

export {
  fastify,
  addHook,
  register,
  listen,
};
export default fastify;
