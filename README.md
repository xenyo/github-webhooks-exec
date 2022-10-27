# github-webhooks-exec

Execute shell commands in response to GitHub webhook requests.

## Features

- Works with pm2 to start automatically on boot
- Queues commands to prevent multiple commands from executing simultaneously

## Requirements

- Node.js
- pm2
- An open port for listening to requests, for example 3000

## Installation

```bash
# npm
npm install github-webhooks-exec

# yarn
yarn add github-webhooks-exec

# pnpm
pnpm add github-webhooks-exec
```

## Usage

Create a file `webhooks.js` in the directory where you want to execute shell commands from:

```js
// ESM
import { queue, server, webhooks } from 'github-webhooks-exec';

// CommonJS
const { queue, server, webhooks } = require('github-webhooks-exec');
```

Add webhook handlers:

```js
webhooks.on('push', event => {
  queue.push('pwd');
});
```

Listen for requests:

```js
server.listen(process.env.GITHUB_WEBHOOKS_PORT);
```

Create a file `.env` in the same directory as `webhooks.js`:

```ini
GITHUB_WEBHOOKS_PORT=3000
GITHUB_WEBHOOKS_SECRET=password
```

Generate a long random string for `GITHUB_WEBHOOKS_SECRET`.

See `/examples` for a complete working example.

## Starting the server

Ensure pm2 is installed and set up:

```bash
# Install pm2 globally
pnpm add -g pm2

# Install pm2 startup script
pm2 startup
```

Start the server using pm2:

```bash
pm2 start webhooks.js --watch
```

Save the pm2 app list to be restored at reboot:

```bash
pm2 save
```

## Add the webhook on GitHub

Navigate to Settings > Webhooks on your GitHub repository or organization and add a webhook with the following settings:

| Field | Value |
| --- | --- |
| Payload URL | https://your.domain:3000/api/github/webhooks |
| Content type | application/json |
| Secret | The value of `GITHUB_WEBHOOKS_SECRET` in the `.env` file |
| Which events would you like to trigger this webhook? | Just the `push` event |
| Active | checked |

## View logs

Install `pino-pretty`:

```bash
# npm
npm i -g pino-pretty

# yarn
yarn add -g pino-pretty

# pnpm
pnpm add -g pino-pretty
```

Tail logs:

```bash
pm2 logs --raw | pino-pretty
```
