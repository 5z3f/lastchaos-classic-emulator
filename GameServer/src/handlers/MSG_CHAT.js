const log = require('@local/shared/logger');
const game = global.game;

const Monster = require('../gameobject/monster');
const { InventoryRow } = require('../system/inventory');
const { Statistic, Modifier, ModifierType } = require('../types/statistic');
const Position = require('../types/position');
const api = require('../api');

module.exports = {
    name: 'MSG_CHAT',
    handle: async function (session, msg)
    {
        var data = {
            'chatType': msg.read('u8'),
            'senderId': msg.read('i32>'),
            'senderName': msg.read('stringnt'),
            'receiverName': msg.read('stringnt'),
            'text': msg.read('stringnt')
        };

        if(data.text.includes('.speedup')) {
            var params = data.text.split(' ');
            var speed = parseFloat(params[1]);

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);
            var runSpeedBefore = character.statistics.runSpeed.getCurrentValue();
            character.statistics.runSpeed.set(speed);

            session.send.chat({
                chatType: 6,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverName: data.receiverName,
                text: `speedup [uid: ${ character.uid }] (before: ${ runSpeedBefore }, after: ${ speed })`
            });
        }
        else if(data.text.includes('.spawn')) {
            var params = data.text.split(' ');
            var npcId = parseInt(params[1]);

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);

            // find monster from database by id
            var baseMonster = game.content.find('monster', (m) => m.id == npcId);

            console.log('baseMonster', baseMonster);

            var monster = new Monster({
                id: baseMonster.id,
                flags: baseMonster.flags,
                level: baseMonster.level,
                zone: character.zone,
                position: character.position,
                respawnTime: 0, // TODO:
                statistics: {
                    health:         new Statistic(baseMonster.statistics.health),
                    maxHealth:      new Statistic(baseMonster.statistics.health),
                    mana:           new Statistic(baseMonster.statistics.mana),
                    maxMana:        new Statistic(baseMonster.statistics.mana),
                    strength:       new Statistic(baseMonster.statistics.strength),
                    dexterity:      new Statistic(baseMonster.statistics.dexterity),
                    intelligence:   new Statistic(baseMonster.statistics.intelligence),
                    condition:      new Statistic(baseMonster.statistics.condition),
                    attack:         new Statistic(baseMonster.statistics.attack),
                    magicAttack:    new Statistic(baseMonster.statistics.magicAttack),
                    defense:        new Statistic(baseMonster.statistics.defense),
                    magicResist:    new Statistic(baseMonster.statistics.magicResist),
                    walkSpeed:      new Statistic(baseMonster.statistics.walkSpeed),
                    runSpeed:       new Statistic(baseMonster.statistics.runSpeed),
                    attackRange:    new Statistic(baseMonster.statistics.attackRange),
                    attackSpeed:    new Statistic(baseMonster.statistics.attackSpeed),                    
                }
            });
    
            game.world.add({ type: 'monster', zoneId: 0, data: monster });
            monster.appear(character);

            character.event.on('move', (pos) => {
                session.send.move({
                    objType: 1,
                    moveType: 1,
                    uid: monster.uid,
                    speed: 5,
                    position: {
                        'x': character.position.x-2,
                        'y': character.position.y-2,
                        'z': character.position.z,
                        'r': character.position.r,
                        'layer': character.position.layer
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
        else if(data.text.includes('.itemget')) {
            var params = data.text.split(' ');

            var itemId = parseInt(params[1]);
            var itemStack = parseInt(params[2]);
            var itemPlus = parseInt(params[3]);

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);

            var itemUid = await api.item.create({
                id: itemId,
                owner: character,
                stack: itemStack || 1,
                plus: itemPlus || 0,
                into: 'inventory'
            });
    
            // TODO: log and raise error message
            if(!itemUid)
                return;
                
            session.send.chat({
                chatType: 6,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverName: data.receiverName,
                text: `itemget [uid: ${ itemUid }, id: ${ itemId }]`
            });            
        }
        else if(data.text.includes('.itemdrop')) {
            var params = data.text.split(' ');

            var itemId = parseInt(params[1]);
            var itemStack = parseInt(params[2]);
            var itemPlus = parseInt(params[3]);

            if(!itemId)
                return;

            var character = game.world.find('character', (ch) => ch.uid == data.senderId);

            var itemUid = await api.item.create({
                id: itemId,
                owner: character,
                stack: itemStack || 1,
                plus: itemPlus || 0
            });

            // TODO: log and raise error message
            if(!itemUid)
                return;

            character.session.send.item('MSG_ITEM_DROP', {
                uid: itemUid,
                id: itemId,
                stack: itemStack || 1,
                position: character.position,
                objType: 1,
                objUid: character.uid
            });

            character.session.send.chat({
                chatType: 6,
                senderId: character.uid,
                senderName: character.nickname,
                receiverName: character.nickname,
                text: `itemdrop [uid: ${ itemUid }, id: ${ itemId }]`
            });
        }
        else if(data.text.includes('.search item')) {
            var params = data.text.split(' ');
            var items = game.content.filter('item', (i) => i.name.toLowerCase().includes(params[2].toLowerCase()))

            for(var item of items) {
                session.send.chat({
                    chatType: 0,
                    senderId: -1,
                    senderName: '',
                    receiverName: data.receiverName,
                    text: `ID: ${ item.id} [${ item.name }]`
                });  
            }
        }
        else if(data.text.includes('.levelup')) {
            var newLevel = Number(data.text.split(' ')[1]);

            if(newLevel) {
                if(newLevel < 1 || newLevel > 1000)
                    return;

                session.character.progress.level = newLevel;
            }
            else
                session.character.progress.level += 1;

            session.character.progress.experience = 0;
            session.character.updateStatistics();

            session.send.effect(1, {
                effectType: 0,
                objType: session.character.objType,
                charUid: session.character.uid
            });
        }
        else {
            // resend
            session.send.chat(data);
        }
    }
}