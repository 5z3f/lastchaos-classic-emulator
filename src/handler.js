const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('./log');
const message = require('./message');

const handler =
{
    onData: (data, toGameServer) =>
    {
        const reader = SmartBuffer.fromBuffer(data);

        // read packet
        var msg = message.read(reader);

        // read message id
        var messageId = msg.reader.readUInt8();

        log.data(`[IN]  >> '0x${ messageId.toString(16) }' >> bytes: ${ msg.reader.toBuffer().toString('hex') }`);

        // read message data
        switch(messageId)
        {
            case 0x03: require('./messages/MSG_LOGIN.js').onReceive(msg, toGameServer); break;
            case 0x04: require('./messages/MSG_MENU.js').onReceive(msg); break;
            case 0x05: require('./messages/MSG_START_GAME.js').onReceive(msg); break;
            case 0x17: require('./messages/MSG_SYS.js').onReceive(msg); break;
            case 0x0F: require('./messages/MSG_CHAT.js').onReceive(msg); break;
        }

    }
}

module.exports = {
    on: (e, data, toGameServer) => {
        if(e == 'data')
            handler.onData(data, toGameServer);
    }
};