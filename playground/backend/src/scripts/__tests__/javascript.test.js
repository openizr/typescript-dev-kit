import fastify, { register, addHook, listen } from 'scripts/lib/__mocks__/fastify';

jest.mock('ajv');
jest.mock('ajv-errors');
jest.spyOn(process, 'exit').mockImplementation((code) => code);

describe('javascript', () => {
  beforeEach(() => {
    process.env.PLAYGROUND_PORT = '4000';
    process.env.ENV = 'test';
    jest.clearAllMocks();
  });

  test('correctly initializes server - development mode', () => {
    delete process.env.PLAYGROUND_PORT;
    process.env.ENV = 'development';
    jest.isolateModules(() => {
      jest.doMock('fastify', () => fastify);
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      require('scripts/javascript');
      expect(fastify).toHaveBeenCalledTimes(1);
      expect(fastify).toHaveBeenCalledWith({
        connectionTimeout: 3000,
        ignoreTrailingSlash: true,
        keepAliveTimeout: 2000,
        logger: { level: 'info' },
      });
      expect(register).toHaveBeenCalledTimes(1);
      expect(addHook).toHaveBeenCalledTimes(1);
      expect(listen).toHaveBeenCalledTimes(1);
      expect(listen).toHaveBeenCalledWith(3000, '0.0.0.0', expect.any(Function));
    });
  });

  test('correctly initializes server - production mode', () => {
    process.env.ENV = 'production';
    jest.isolateModules(() => {
      jest.doMock('fastify', () => fastify);
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      require('scripts/javascript');
      expect(fastify).toHaveBeenCalledTimes(1);
      expect(fastify).toHaveBeenCalledWith({
        connectionTimeout: 3000,
        ignoreTrailingSlash: true,
        keepAliveTimeout: 2000,
        logger: { level: 'error' },
      });
      expect(register).toHaveBeenCalledTimes(1);
      expect(addHook).not.toHaveBeenCalled();
      expect(listen).toHaveBeenCalledTimes(1);
      expect(listen).toHaveBeenCalledWith(4000, '0.0.0.0', expect.any(Function));
    });
  });
});
