import postMessage from 'scripts/routes/v1/postMessage';

jest.mock('fastify');

describe('routes/v1/postMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('correctly handles request', () => {
    const send = jest.fn();
    postMessage.handler({}, { send });
    expect(postMessage.schema).toMatchSnapshot();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith();
  });
});
