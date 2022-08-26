const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        var subType = receivedMsg.read('u8');
        log.data(`SYS SUB TYPE >> '${ subType }'`);
    }
}