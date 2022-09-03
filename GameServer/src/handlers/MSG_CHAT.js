const log = require('@local/shared/logger');
const Monster = require('../object/monster');
const game = require('../game');
const { Statistic } = require('../types');

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

            var character = game.find('character', data.senderId);
            var runSpeedBefore = character.statistics.runSpeed.total;

            character.update('stats', {
                'runSpeed': new Statistic(speed)
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

            var character = game.find('character', data.senderId);

            let monster = new Monster({
                id: npcId,
                zoneId: character.zoneId,
                areaId: character.areaId,
                position: character.position,
            });
    
            game.add('monster', monster);
            monster.appear(session);

            character.event.on('move', (pos) =>
            {
                session.send.move({
                    objType: 1,
                    moveType: 1,
                    uid: monster.uid,
                    speed: 5,
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
                text: `spawn [uid: ${ monster.uid }, npcId: ${ npcId }]`
            });
        }
        else
        {
            // resend
            session.send.chat(data);
        }
    }
}