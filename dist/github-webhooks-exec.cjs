var webhooks$1 = require('@octokit/webhooks');
var dotenv = require('dotenv');
var fastq = require('fastq');
var http = require('http');
var pino = require('pino');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);
var fastq__default = /*#__PURE__*/_interopDefaultLegacy(fastq);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var pino__default = /*#__PURE__*/_interopDefaultLegacy(pino);

dotenv__default["default"].config();
const logger = pino__default["default"]();
const queue = fastq__default["default"]((command, cb) => {
  logger.info(command);
  const child = child_process.spawn(command, {
    shell: true,
    timeout: 900 * 1000 // 15 minutes
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
const webhooks = new webhooks$1.Webhooks({
  secret: process.env.GITHUB_WEBHOOKS_SECRET
});
const server = http__default["default"].createServer(webhooks$1.createNodeMiddleware(webhooks));

exports.logger = logger;
exports.queue = queue;
exports.server = server;
exports.webhooks = webhooks;
