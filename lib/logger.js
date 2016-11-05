'use strict';

var bunyan = require('bunyan');
var config = require('config');

var logger = module.exports = bunyan.createLogger({name: 'cppfiddle-server'});
logger.level(config.get('logging.level'))
