import { Webhooks, createNodeMiddleware } from '@octokit/webhooks';

import dotenv from 'dotenv';
import fastq from 'fastq';
import http from 'http';
import pino from 'pino';
import { spawn } from 'child_process';

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

export { webhooks, queue, server, logger };
