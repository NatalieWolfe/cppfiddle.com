'use strict';

// var newrelic = require('newrelic');

var Promise = require('bluebird');

var bodyParser = require('body-parser');
var cp = Promise.promisifyAll(require('child_process'));
var express = require('express');
var fs = Promise.promisifyAll(require('fs'));
var http = require('http');
var path = require('path');

var logger = require('./lib/logger').child({component: 'main'});
logger.level('debug');

const PORT = process.env.PORT || 8080;

var app = express();
var server = http.createServer(app);
app.set('views', path.resolve(__dirname, './assets/views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    logger.debug({path: req.path, ip: req.ip}, 'Request received.');
    next();
});
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res, next) => {
    // res.send('hello!');
    res.render('index');
});

app.post('/execute', (req, res, next) => {
    var code = [
        '#include <iostream>',
        'int main() {',
        req.body.code,
        '}'
    ].join('\n');

    fs.writeFileAsync('test.cpp', code)
        .then(() => cp.execAsync('g++ test.cpp'))
        .then(() => cp.execAsync('./a.out'))
        .then(
            (output) => res.send(output.toString()),
            (err) => {
                logger.error({error: err}, 'Failed to execute file.');
                res.status(400).send('Failed to compile code.');
            }
        );
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

