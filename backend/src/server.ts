import { buildApp } from './app.js';

const DEFAULT_PORT = 3000;

function getPort(rawPort: string | undefined): number {
  if (rawPort === undefined) {
    return DEFAULT_PORT;
  }

  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
}

const app = buildApp();

try {
  await app.listen({
    host: process.env.HOST ?? '0.0.0.0',
    port: getPort(process.env.PORT),
  });
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
