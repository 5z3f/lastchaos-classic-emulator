const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {        
        var chatMessageData = {
            'chatType': receivedMsg.read('u8'),
            'senderId': receivedMsg.read('i32>'),
            'senderName': receivedMsg.read('stringnt'),
            'receiverName': receivedMsg.read('stringnt'),
            'text': receivedMsg.read('stringnt')
        }

        const chatMessage = ({ chatType, senderId, senderName, receiverName, text }) => {
            // MSG_CHAT
            var msg = new message({ type: 0x0F });
            
            msg.write('u8', chatType);

            msg.write('i32>', senderId);            // senderId
            msg.write('stringnt', senderName);      // senderName
            msg.write('stringnt', receiverName);    // receiverName
            msg.write('stringnt', text);            // text

            return msg.build({ clientId: receivedMsg.clientId });
        }

        // resend
        log.data(`[OUT] << CHATTING  [${ JSON.stringify(chatMessageData) }]`);

        server.send(chatMessage({
            chatType: chatMessageData.chatType,
            senderId: chatMessageData.senderId,
            senderName: chatMessageData.senderName,
            receiverName: chatMessageData.receiverName,
            text: chatMessageData.text,
        }));
        
        // log.data(`[OUT] << 'MSG_CHAT -> ...' (0x0F > ...)`);

        if(chatMessageData.text == 'whoami')
        {
            const gmMessage = ({ level }) => {
                // MSG_GM
                var msg = new message({ type: 0x17 });
                msg.write('u8', level) // level
                
                return msg.build({ clientId: receivedMsg.clientId });
            }

            server.send(gmMessage({ level: 10 }));

            log.data(`[OUT] << 'MSG_GM' (0x17) (level 10)`);

            server.send(chatMessage({
                chatType: 7, // MSG_CHAT_GM
                senderId: 0,
                senderName: '',
                receiverName: '',
                text: 'whoami',
            }));

            // log.data(`[OUT] << 'MSG_CHAT -> MSG_CHAT_GM' (0x0F > 0x07)`);
        }
        else if(chatMessageData.text.includes('goto'))
        {
            var pos = chatMessageData.text.split(' ');

            const gotoMessage = ({ zoneId, x, z, h }) => {
                // MSG_GOTO
                var msg = new message({ type: 0x13 });

                msg.write('i32>', zoneId);  // Zone ID
                msg.write('f<', x);         // X
                msg.write('f<', z);         // Z
                msg.write('f<', 160);       // H
                msg.write('f<', 0);         // R
                msg.write('u8', 0);         // Y LAYER

                return msg.build({ clientId: receivedMsg.clientId });
            }

            log.data(`[OUT]  >> 'MSG_GOTO' (0x13)`);
            server.send(gotoMessage({ zoneId: 0, X: pos[0], Z: pos[1], H: pos[2] }));
        }
        else if(chatMessageData.text.includes('gozone'))
        {
            var pos = chatMessageData.text.split(' ');

            const gozoneMessage = ({ zoneId, extraId }) => {
                // MSG_GO_ZONE
                var msg = new message({ type: 0x12 });

                msg.write('i32>', zoneId);      // Zone ID
                msg.write('i32>', extraId);     // SubZone ID
                msg.write('u8', '127.0.0.1');   // Zone GameServer IP
                msg.write('i32>', 4190);        // Zone GameServer Port

                return msg.build({ clientId: receivedMsg.clientId });
            }

            log.data(`[OUT]  >> 'MSG_GO_ZONE' (0x12)`);
            server.send(gozoneMessage({ zoneId: pos[0], X: pos[1], Z: pos[2], H: pos[3] }));
        }
    }
}