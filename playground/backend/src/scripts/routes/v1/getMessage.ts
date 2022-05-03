import basx from 'basx';
import schema from 'scripts/lib/baseSchema';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * `GET /v1/message` endpoint handler.
 */
export default {
  handler: (_request: FastifyRequest, response: FastifyReply): void => {
    response.send({ message: 'WELCOME_MESSAGE' });
  },
  schema: basx.deepMerge(
    schema,
    {
      body: undefined,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  ),
};
