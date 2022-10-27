var webhooks$1 = require('@octokit/webhooks');
var dotenv = require('dotenv');
var child_process = require('child_process');
var fastq = require('fastq');
var http = require('http');
var pino = require('pino');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);
var fastq__default = /*#__PURE__*/_interopDefaultLegacy(fastq);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var pino__default = /*#__PURE__*/_interopDefaultLegacy(pino);

dotenv__default["default"].config();
const logger = pino__default["default"]();
const queue = fastq__default["default"]((command, cb) => {
  logger.info(command);
  child_process.exec(command, {
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
const webhooks = new webhooks$1.Webhooks({
  secret: process.env.GITHUB_WEBHOOKS_SECRET
});
const server = http__default["default"].createServer(webhooks$1.createNodeMiddleware(webhooks));

exports.queue = queue;
exports.server = server;
exports.webhooks = webhooks;
