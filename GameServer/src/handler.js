const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('@local/shared/logger');
const message = require('@local/shared/message');

const handler =
{
    onData: (data) =>
    {
        // read packet
        var msg = new message({ buffer: data, header: false });

        // read message id
        var messageId = msg.read('u8');

        log.data(`[IN]  >> '0x${ messageId.toString(16) }' >> bytes: ${ msg.buffer().toString('hex') }`);
        
        // FIXME: Disallow access to all packets except 0x03 if client is not logged in
        // FIXME: Add GameObject to socket

        // handle messages
        switch(messageId)
        {
            case 0x03: require('./messages/MSG_LOGIN.js').onReceive(msg); break;
            case 0x04: require('./messages/MSG_MENU.js').onReceive(msg); break;
            case 0x05: require('./messages/MSG_START_GAME.js').onReceive(msg); break;
            case 0x17: require('./messages/MSG_GM.js').onReceive(msg); break;
            case 0x0F: require('./messages/MSG_CHAT.js').onReceive(msg); break;
            case 0x26: require('./messages/MSG_PULSE.js').onReceive(msg); break;
            case 0x0C: require('./messages/MSG_MOVE.js').onReceive(msg); break;
        }

    }
}

module.exports = {
    on: (e, data) => {
        if(e == 'data')
            handler.onData(data);
    }
};