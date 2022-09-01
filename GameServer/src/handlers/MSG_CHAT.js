const message = require('@local/shared/message');
const log = require('@local/shared/logger');
const object = require('../object');

module.exports = {
    name: 'MSG_CHAT',
    handle: function (session, msg)
    {
        var data = {
            'chatType': msg.read('u8'),
            'senderId': msg.read('i32>'),
            'senderName': msg.read('stringnt'),
            'receiverName': msg.read('stringnt'),
            'text': msg.read('stringnt')
        };

        if(data.text.includes('.speedup'))
        {
            var params = data.text.split(' ');
            var speed = parseFloat(params[1]);

            var character = object.get({ uid: data.senderId });
            var runSpeedBefore = character.stats.runSpeed;

            character.update({
                session: session, 
                type: 'stats',
                data: {
                    'runSpeed': speed
                }
            });

            session.send.chat({
                chatType: 6,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverName: data.receiverName,
                text: `speedup [uid: ${ character.uid }] (before: ${ runSpeedBefore }, after: ${ speed })`
            });
        }
        if(data.text.includes('.spawn'))
        {
            var params = data.text.split(' ');
            var npcId = parseInt(params[1]);

            var character = object.get({ uid: data.senderId });

            var npc = new object({
                type: 1,
                id: npcId,
                position: {
                    'zoneId': character.position.zoneId,
                    'areaId': character.position.areaId,
                    'x': character.position.x,
                    'z': character.position.z,
                    'h': character.position.h,
                    'r': character.position.r,
                    'y': character.position.y
                }
            });
    
            npc.appear(session);

            character.event.on('move', (pos) =>
            {
                session.send.move({
                    objType: 1,
                    moveType: 1,
                    uid: npc.uid,
                    runSpeed: 5,
                    position: {
                        'x': character.position.x-2,
                        'z': character.position.z-2,
                        'h': character.position.h,
                        'r': character.position.r,
                        'y': character.position.y
                    }
                })
            });

            session.send.chat({
                chatType: 6,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverName: data.receiverName,
                text: `spawn [uid: ${ npc.uid }, npcId: ${ npcId }]`
            });
        }
        else
        {
            // resend
            session.send.chat(data);
        }
    }
}