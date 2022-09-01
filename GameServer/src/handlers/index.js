const fs = require('fs');
const path = require('path');
const messages = require('./_messages.json');

var handlers = {};

fs.readdirSync(__dirname).forEach(function (file) {
    if (file === path.basename(__filename) || !/\.js$/.test(file))
        return;

    var handler = require(__dirname + '/' + file);

    if (messages.hasOwnProperty(handler.name))
        handlers[messages[handler.name]] = handler.handle;
});

module.exports = handlers;