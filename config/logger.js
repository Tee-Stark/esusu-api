const pino = require('pino');
const pretty = require('pino-pretty');

module.exports = pino(pretty());