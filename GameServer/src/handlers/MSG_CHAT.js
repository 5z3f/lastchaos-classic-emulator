const log = require('@local/shared/logger');
const game = require('../game');

const Monster = require('../object/monster');
const { InventoryRow } = require('../system/inventory');
const { Statistic, Position } = require('../types');
const util = require('../util');

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

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);
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

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);

            let monster = new Monster({
                id: npcId,
                zoneId: character.zoneId,
                areaId: character.areaId,
                position: character.position,
            });
    
            game.world.add('monster', monster);
            monster.appear(session);

            character.event.on('move', (pos) =>
            {
                session.send.move({
                    objType: 1,
                    moveType: 1,
                    uid: monster.uid,
                    speed: new Statistic(5),
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
        if(data.text.includes('.itemget'))
        {
            var params = data.text.split(' ');

            var itemId = parseInt(params[1]);
            var itemCount = parseInt(params[2]);
            var itemPlus = parseInt(params[3]);

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);
            var dbItem = game.database.find('item', (el) => el.id == itemId);

            if(dbItem == null)
                return; // raise error message
            
            // add item to inventory
            var invenRow = new InventoryRow({
                itemId: dbItem.id,
                plus: itemPlus || 0,
                count: itemCount
            });
            
            var success = character.inventory.add(0, invenRow);
            
            if(!success)
                return;
                
            session.send.chat({
                chatType: 6,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverName: data.receiverName,
                text: `itemget [uid: ${ invenRow.itemUid }, itemId: ${ dbItem.id }, name: ${ dbItem.name }]`
            });            
        }
        if(data.text.includes('.itemdrop'))
        {
            var params = data.text.split(' ');

            var itemId = parseInt(params[1]);
            var itemCount = parseInt(params[2]);
            var itemPlus = parseInt(params[3]);

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);
            var dbItem = game.database.find('item', (el) => el.id == itemId);

            if(dbItem == null)
                return; // raise error message
                        
            var itemUid = util.generateId();

            // add item to on-ground item list
            game.world.add({ type: 'item', zoneId: character.zoneId, data: {
                uid: itemUid,
                id: itemId,
                count: itemCount || 1,
                charUid: character.uid,
                position: new Position(character.position)
            }});
            
            session.send.item('MSG_ITEM_DROP', {
                uid: itemUid,
                id: itemId,
                count: itemCount || 1,
                position: character.position,
                objType: 1,
                objUid: character.uid
            });

            session.send.chat({
                chatType: 6,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverName: data.receiverName,
                text: `itemdrop [uid: ${ itemUid }, itemId: ${ dbItem.id }, name: ${ dbItem.name }]`
            });
        }
        else
        {
            // resend
            session.send.chat(data);
        }
    }
}