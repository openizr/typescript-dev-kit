import { deepMerge } from 'basx';
import schema from 'scripts/lib/baseSchema';
import { FastifyRequest, FastifyReply } from 'fastify';

const routeSchema = deepMerge(
  schema,
  {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
) as any;

delete routeSchema.body;

/**
 * `GET /v1/message` endpoint handler.
 */
export default {
  handler: (_request: FastifyRequest, response: FastifyReply): void => {
    response.send({ message: 'WELCOME_MESSAGE' });
  },
  schema: routeSchema,
};
