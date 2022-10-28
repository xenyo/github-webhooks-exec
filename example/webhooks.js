import { queue, server, webhooks, logger } from 'github-webhooks-exec';

webhooks.on('push', event => {
  const commands = [
    "git diff HEAD --exit-code",
    "git pull",
  ];
  queue.push(commands.join(" && "));
});

server.listen(process.env.GITHUB_WEBHOOKS_PORT);
logger.info('Ready');
