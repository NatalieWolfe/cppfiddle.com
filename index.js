'use strict';

// var newrelic = require('newrelic');

var bodyParser = require('body-parser');
var config = require('config');
var express = require('express');
var http = require('http');
var path = require('path');

var logger = require('./lib/logger').child({component: 'main'});

const PORT = config.get('server.port');


var app = express();
var server = http.createServer(app);
app.set('views', path.resolve(__dirname, './assets/views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    logger.debug({path: req.path, ip: req.ip}, 'Request received.');
    next();
});

app.use('/assets', express.static(path.resolve(__dirname, './static')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res, next) => {
    res.render('index');
});

var interuptCount = 0;
process.on('SIGINT', () => {
    /* eslint-disable no-console */
    if (++interuptCount === 1) {
        console.log('Shutting down. Press ^C again to force close.');
        server.close(() => console.log('Done.'));
    }
    else {
        console.log('Forcing process closing.');
        process.exit(0);
    }
    /* eslint-enable no-console */
});

server.listen(PORT, () => {
    logger.info('Server listening on %d', PORT);
});

server.on('close', () => {
    logger.info('Server closed.');
    // newrelic.shutdown()
});
