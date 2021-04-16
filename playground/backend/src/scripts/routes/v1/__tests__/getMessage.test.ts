import getMessage from 'scripts/routes/v1/getMessage';
import { FastifyRequest, FastifyReply } from 'fastify';

jest.mock('fastify');

describe('routes/v1/getMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('correctly handles request', () => {
    const send = jest.fn();
    getMessage.handler({} as FastifyRequest, { send } as unknown as FastifyReply);
    expect(getMessage.schema).toMatchSnapshot();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({ message: 'WELCOME_MESSAGE' });
  });
});
