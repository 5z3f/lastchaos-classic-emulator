const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

const object = require('../object');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        var chatMessageData = {
            'chatType': receivedMsg.read('u8'),
            'senderId': receivedMsg.read('i32>'),
            'senderName': receivedMsg.read('stringnt'),
            'receiverName': receivedMsg.read('stringnt'),
            'text': receivedMsg.read('stringnt')
        };

        const chatMessage = ({ chatType, senderId, senderName, receiverName, text }) => {
            // MSG_CHAT
            var msg = new message({ type: 0x0F });
            
            msg.write('u8', chatType);

            msg.write('i32>', senderId);            // senderId (Unique ID)
            msg.write('stringnt', senderName);      // senderName
            msg.write('stringnt', receiverName);    // receiverName
            msg.write('stringnt', text);            // text

            return msg.build({ });
        }

        if(chatMessageData.text.includes('goto'))
        {
            var params = chatMessageData.text.split(' ');

            const gotoMessage = ({ zoneId, x, z, h }) => {
                // MSG_GOTO
                var msg = new message({ type: 0x13 });

                msg.write('i32>', parseInt(zoneId));  // Zone ID
                msg.write('f<', parseInt(x));         // X
                msg.write('f<', parseInt(z));         // Z
                msg.write('f<', 160);       // H
                msg.write('f<', 0);         // R
                msg.write('u8', 0);         // Y LAYER

                return msg.build({ });
            }

            log.data(`[OUT]  >> 'MSG_GOTO' (0x13)`);
            server.send(gotoMessage({ zoneId: 0, X: params[1], Z: params[2]/*, H: params[3]*/ }));
        }
        else if(chatMessageData.text.includes('gozone'))
        {
            var params = chatMessageData.text.split(' ');

            const gozoneMessage = ({ zoneId, extraId }) => {
                // MSG_GO_ZONE
                var msg = new message({ type: 0x12 });

                msg.write('i32>', parseInt(zoneId));      // Zone ID
                msg.write('i32>', parseInt(extraId));     // SubZone ID
                msg.write('u8', '127.0.0.1');   // Zone GameServer IP
                msg.write('i32>', 4190);        // Zone GameServer Port

                return msg.build({ });
            }

            log.data(`[OUT]  >> 'MSG_GO_ZONE' (0x12)`);
            server.send(gozoneMessage({ zoneId: params[1], extraId: params[2] }));
        }
        else if(chatMessageData.text.includes('.speedup'))
        {
            var params = chatMessageData.text.split(' ');
            var speed = parseFloat(params[1]);

            // sender character (client)
            var sender = object.get({ uid: chatMessageData.senderId });
            var runSpeedBefore = sender.stats.runSpeed;

            sender.statistics({
                action: 'update',
                data: {
                    'runSpeed': speed
                }
            });

            server.send(chatMessage({
                chatType: 6,
                senderId: chatMessageData.senderId,
                senderName: chatMessageData.senderName,
                receiverName: chatMessageData.receiverName,
                text: `speedup [uid: ${ sender.uid }] (before: ${ runSpeedBefore }, after: ${ speed })`,
            }));

        }
        else if(chatMessageData.text.includes('.a'))
        {
            var params = chatMessageData.text.split(' ');
            var npcId = params[1];

            if(npcId == undefined)
                return;

            // sender character (client)
            var sender = object.get({ uid: chatMessageData.senderId });

            var obj = new object({ type: OBJECT_NPC, id: npcId, position: {
                zoneId: sender.position.zoneId,
                X: sender.position.x,
                Z: sender.position.z,
                H: sender.position.h,
                R: sender.position.r,
                Y: sender.position.y
            }});
            
            obj.appear();

            server.send(chatMessage({
                chatType: 7,
                senderId: chatMessageData.senderId,
                senderName: chatMessageData.senderName,
                receiverName: chatMessageData.receiverName,
                text: `appear [npcUid: ${ obj.uid }, npcId: ${ npcId }, x: ${ sender.position.x }, z: ${ sender.position.z }, clientId: ${ sender.uid }`,
            }));
        }
        else
        {
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

        }
    }
}