# github-webhooks-exec

Execute shell commands on GitHub webhook events.

- Works with pm2 to start automatically on boot
- Queues commands to ensure sequential execution

## Requirements

- Node.js
- pm2

## Installation

```bash
npm install github-webhooks-exec
```

## Initial setup

### webhooks.js

Create `webhooks.js` in the directory where you want to execute shell commands from:

```js
const { webhooks, queue, logger } = require('github-webhooks-exec');

webhooks.on('push', event => {
  logger.info('Received push event');
  const commands = [
    'set -e',
    // etc.
  ];
  queue.push(commands.join('; '));
});
```

### .env

Create `.env` in the same directory:

```ini
GITHUB_WEBHOOKS_PORT=3000
GITHUB_WEBHOOKS_SECRET=password
```

Generate a long random string for `GITHUB_WEBHOOKS_SECRET`.

### ecosystem.config.js

Create `ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: 'my-project-webhooks',
      script: './webhooks.js',
    },
  ],
};
```

## Running the server

Ensure pm2 is installed and set up:

```bash
npm install -g pm2
pm2 startup
```

Start the server:

```bash
pm2 start ecosystem.config.js
```

Save the pm2 app list to be restored on reboot:

```bash
pm2 save
```

## Adding the webhook on GitHub

In Settings > Webhooks of any GitHub repository or organization, add a webhook with the following settings:

| Field | Value |
| --- | --- |
| Payload URL | https://your.domain:3000/api/github/webhooks |
| Content type | application/json |
| Secret | The value of `GITHUB_WEBHOOKS_SECRET` in the `.env` file |
| Which events would you like to trigger this webhook? | Just the `push` event |
| Active | checked |

## Viewing logs

Install `pino-pretty`:

```bash
npm i -g pino-pretty
```

Tail logs:

```bash
pm2 logs --raw | pino-pretty
```

## API Reference

`github-webhooks-exec` provides the following named exports:

### webhooks

A `Webhooks` instance initialized with `GITHUB_WEBHOOKS_SECRET` from `.env`.

See https://github.com/octokit/webhooks.js/

### queue

A `fastq` instance that runs shell commands sequentially.

https://github.com/mcollina/fastq

### logger

A `pino` logger instance.

See https://github.com/pinojs/pino
