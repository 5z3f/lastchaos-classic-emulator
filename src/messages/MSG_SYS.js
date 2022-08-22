const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('../log');
const server = require('../server');
const message = require('../message');

module.exports = {
    onReceive: (msg) =>
    {
        var reader = msg.reader;
        var subType = reader.readUInt8();
            
        log.data(`SYS SUB TYPE >> '${ subType }'`);

    }
}