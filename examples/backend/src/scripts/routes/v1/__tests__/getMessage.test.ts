import getMessage from 'scripts/routes/v1/getMessage';
import { FastifyRequest, FastifyReply } from 'fastify';

vi.mock('fastify');

describe('routes/v1/getMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('correctly handles request', () => {
    const send = vi.fn();
    getMessage.handler({} as FastifyRequest, { send } as unknown as FastifyReply);
    expect(getMessage.schema).toMatchSnapshot();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({ message: 'WELCOME_MESSAGE' });
  });
});
