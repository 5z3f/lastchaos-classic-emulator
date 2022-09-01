const fs = require('fs');
const path = require('path');
const messages = require('./_messages.json');

var aliasMap = {};
var senders = {};

fs.readdirSync(__dirname).forEach((file) =>
{
    if (file === path.basename(__filename) || !/\.js$/.test(file))
        return;

    var sender = require(__dirname + '/' + file);

    if (messages.hasOwnProperty(sender.messageName))
    {
        var fileNameWithoutExtension = file.slice(0, -3);

        senders[fileNameWithoutExtension] = sender.send;
        aliasMap[fileNameWithoutExtension] = sender.messageName;
    }
});

module.exports = ({ session }) =>
{
    var send = [];
    
    Object.keys(senders).forEach((name) => {
        send[name] = senders[name](session, messages[aliasMap[name]]);
    });

    return send;
};