const log = require('@local/shared/logger');
const Message = require('@local/shared/message');

module.exports = {
    messageName: 'CUSTOM_PACKET',
    send: function (session, msgId)
    {
        return (byteString, packType) =>
        {
            if (byteString.includes('0x'))
                byteString = byteString.replace(/0x/g, '').split(', ').map((strByte) => (strByte.length === 1) ? `0${strByte}` : strByte).join('');

            var msg = new Message({ buffer: new Buffer.from(byteString, 'hex'), type: !!packType });
            session.write(msg.build());
            
            return `CUSTOM PACKET SENT [BUFFER: ${msg.toString()}]`
        }
    }
}