import { FastifyInstance } from 'fastify';
import v1GetMessage from 'scripts/routes/v1/getMessage';
import v1PostMessage from 'scripts/routes/v1/postMessage';

/**
 * App endpoints declaration.
 */
export default (server: FastifyInstance): void => {
  /**
   * V1 endpoints.
   */
  server.register((app, _options, done) => {
    app.get('/message', v1GetMessage);
    app.post('/message', v1PostMessage);
    done();
  }, { prefix: '/v1' });
};
