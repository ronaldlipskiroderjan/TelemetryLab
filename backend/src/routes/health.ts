import type { FastifyPluginCallback } from 'fastify';

const healthResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['status'],
  properties: {
    status: { type: 'string', const: 'ok' },
  },
} as const;

export const healthRoutes: FastifyPluginCallback = (app, _options, done) => {
  app.get(
    '/health',
    {
      schema: {
        response: {
          200: healthResponseSchema,
        },
      },
    },
    () => ({ status: 'ok' as const }),
  );
  done();
};
