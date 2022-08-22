const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('../log');
const server = require('../server');
const message = require('../message');

module.exports = {
    onReceive: (msg) =>
    {
        var reader = msg.reader;
        
        var chatMessage = {
            'chatType': reader.readUInt8(),
            'senderId': reader.readInt32BE(),
            'senderName': reader.readStringNT(),
            'receiverName': reader.readStringNT(),
            'text': reader.readStringNT()
        }

        log.data(`CHATTING >> ${ JSON.stringify(chatMessage) }`);

        if(chatMessage.text == 'whoami')
        {
            const gmMessage = () => {
                var packet = new SmartBuffer();
                
                packet.writeUInt8(0x17) // MSG_GM
                packet.writeUInt8(10)   // level

                return packet;
            }

            var msgBuf = message.build(gmMessage(), msg.header.clientId);
            server.send(msgBuf);

            log.data(`[OUT] >> 'MSG_GM' (0x17) (level 10)`);
        }

        if(chatMessage.text == 'goto')
        {
            const gotoMessage = () => {
                var packet = new SmartBuffer();
                
                packet.writeUInt8(0x13);    // MSG_GOTO
                packet.writeInt32BE(0);     // zone
                packet.writeFloatBE(535);   // X
                packet.writeFloatBE(845);   // Z
                packet.writeFloatBE(160);   // H
                packet.writeFloatBE(0);     // R
                packet.writeUInt8(0);       // YLAYER

                return packet;
            }

            var msgBuf = message.build(gotoMessage(), msg.header.clientId);
            server.send(msgBuf);

            log.data(`[OUT]  >> 'MSG_GOTO' (0x13)`);
        }
    }
}