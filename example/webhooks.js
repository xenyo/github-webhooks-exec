const { webhooks, queue, logger } = require('github-webhooks-exec');

webhooks.on('push', event => {
  logger.info('Received push event');
  const commands = [
    'set -e',
    'echo test',
  ];
  queue.push(commands.join('; '));
});
