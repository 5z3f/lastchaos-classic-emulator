const log = require('@local/shared/logger');
const message = require('@local/shared/message');


const handler =
{
    onData: (data) =>
    {
        // read packet
        var msg = new message({ buffer: data });

        // read id
        var messageId = msg.read('u8');

        log.data(`[IN]  >> '0x${ messageId.toString(16) }' >> bytes: ${ msg.buffer().toString('hex') }`);

        // read content
        switch(messageId) {
            case 0x03: require('./messages/MSG_LOGIN.js').onReceive(msg); break;
        }
    }
}

module.exports = {
    on: (e, data) => {
        if(e == 'data')
            handler.onData(data);
    }
};