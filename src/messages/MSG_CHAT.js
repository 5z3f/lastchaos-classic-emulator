const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('../log');
const server = require('../server');
const message = require('../message');

module.exports = {
    onReceive: (msg) =>
    {
        var reader = msg.reader;
        
        var chatMessageData = {
            'chatType': reader.readUInt8(),
            'senderId': reader.readInt32BE(),
            'senderName': reader.readStringNT(),
            'receiverName': reader.readStringNT(),
            'text': reader.readStringNT()
        }

        const chatMessage = ({chatType, senderId, senderName, receiverName, text}) => {
            var packet = new SmartBuffer();
            
            packet.writeUInt8(0x0F);             // MSG_CHAT
            packet.writeUInt8(chatType);         // chatType

            packet.writeInt32BE(senderId);       // senderId
            packet.writeStringNT(senderName);    // senderName
            packet.writeStringNT(receiverName);  // receiverName
            packet.writeStringNT(text);          // text

            return packet;
        }

        log.data(`CHATTING >> ${ JSON.stringify(chatMessageData) }`);

        // resend
        var buf = chatMessage({
            chatType: chatMessageData.chatType,
            senderId: chatMessageData.senderId,
            senderName: chatMessageData.senderName,
            receiverName: chatMessageData.receiverName,
            text: chatMessageData.text,
        })

        var msgBuf = message.build(buf, msg.header.clientId);
        server.send(msgBuf);
        
        // log.data(`[OUT] >> 'MSG_CHAT -> ...' (0x0F > ...)`);

        if(chatMessageData.text == 'whoami')
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

            
            var buf = chatMessage({
                chatType: 7, // MSG_CHAT_GM
                senderId: 0,
                senderName: '',
                receiverName: '',
                text: 'Who Am I?',
            })

            msgBuf = message.build(buf, msg.header.clientId);
            server.send(msgBuf);

            // log.data(`[OUT] >> 'MSG_CHAT -> MSG_CHAT_GM' (0x0F > 0x07)`);
        }
        else if(chatMessageData.text == 'goto')
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