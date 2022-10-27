import { queue, server, webhooks } from 'github-webhooks-exec';

import pino from 'pino';

const logger = pino();

webhooks.on('push', event => {
  queue.push('pwd');
});

server.listen(3000);
logger.info('Ready');
