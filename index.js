const { Webhooks, createNodeMiddleware } = require('@octokit/webhooks');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const fastq = require('fastq');
const http = require('http');
const pino = require('pino');

dotenv.config();

const logger = pino();

const queue = fastq((command, cb) => {
  logger.info(command);
  const child = spawn(command, {
    shell: true,
    timeout: 900 * 1000, // 15 minutes
  });
  child.stdout.on('data', data => logger.info(data.toString().trim()));
  child.stderr.on('data', data => logger.warn(data.toString().trim()));
  child.on('close', code => {
    logger.info(`Child process exited with code ${code}`);
    cb(null);
  });
  child.on('error', error => {
    logger.error('Failed to start subprocess.');
    cb(error);
  });
});

const webhooks = new Webhooks({ secret: process.env.GITHUB_WEBHOOKS_SECRET });

const server = http.createServer(createNodeMiddleware(webhooks));

server.listen(process.env.GITHUB_WEBHOOKS_PORT, () => {
  const { port } = server.address();
  logger.info(`Listening on port ${port}`);
});

module.exports = { webhooks, queue, logger };
