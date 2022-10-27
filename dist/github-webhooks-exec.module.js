import { Webhooks, createNodeMiddleware } from '@octokit/webhooks';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import fastq from 'fastq';
import http from 'http';
import pino from 'pino';

dotenv.config();
const logger = pino();
const queue = fastq((command, cb) => {
  logger.info(command);
  exec(command, {
    timeout: 900 * 1000 // 15 minutes
  }, (error, stdout, stderr) => {
    if (error) {
      logger.error(error);
      return cb(error);
    }
    if (stdout) {
      logger.info(stdout);
    }
    if (stderr) {
      logger.warn(stderr);
    }
    cb(null);
  });
});
const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOKS_SECRET
});
const server = http.createServer(createNodeMiddleware(webhooks));

export { queue, server, webhooks };
