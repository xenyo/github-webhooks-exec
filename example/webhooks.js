import { queue, server, webhooks } from 'github-webhooks-exec';

import pino from 'pino';

const logger = pino();

webhooks.on('push', event => {
  const commands = [
    "git diff HEAD --exit-code",
    "git pull",
  ];
  queue.push(commands.join(" && "));
});

server.listen(3000);
logger.info('Ready');
