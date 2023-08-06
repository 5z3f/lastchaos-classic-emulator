import log from '@local/shared/logger';

import Monster from '../gameobject/monster';
import { InventoryRow } from '../system/inventory';
import { Statistic, Modifier, ModifierType } from '../types/statistic';
import Position from '../types/position';
import api from '../api';
import BaseMonster from '../baseobject/monster';
import Character from '../gameobject/character';
import game from '../game';

export default async function (session, msg) {
    let data = {
        chatType: msg.read('u8') as number,
        senderId: msg.read('i32>') as number,
        senderName: msg.read('stringnt') as string,
        receiverName: msg.read('stringnt') as string,
        text: msg.read('stringnt') as string,
    };

    if (data.text.includes('.speedup')) {
        let params = data.text.split(' ');
        let speed = parseFloat(params[1]);

        let character = game.world.find('character', (ch) => ch.uid == data.senderId);
        let runSpeedBefore = character.statistics.runSpeed.getCurrentValue();
        character.statistics.runSpeed.set(speed);

        session.send.chat({
            chatType: 6,
            senderId: data.senderId,
            senderName: data.senderName,
            receiverName: data.receiverName,
            text: `speedup [uid: ${character.uid}] (before: ${runSpeedBefore}, after: ${speed})`
        });
    }
    else if (data.text.includes('.spawn')) {
        let params = data.text.split(' ');
        let npcId = parseInt(params[1]);

        let character = game.world.find('character', (ch: Character) => ch.uid == data.senderId);

        // find monster from database by id
        let baseMonster = game.content.monsters.find((m) => m.id == npcId);

        console.log('baseMonster', baseMonster);
        if (!baseMonster)
            return;

        let monster = new Monster({
            id: baseMonster.id,
            flags: baseMonster.flags,
            level: baseMonster.level,
            zone: character.zone,
            position: character.position,
            respawnTime: 0, // TODO:
            //@ts-ignore
            statistics: {
                health: new Statistic(baseMonster.statistics.health),
                maxHealth: new Statistic(baseMonster.statistics.health),
                mana: new Statistic(baseMonster.statistics.mana),
                maxMana: new Statistic(baseMonster.statistics.mana),
                strength: new Statistic(baseMonster.statistics.strength),
                dexterity: new Statistic(baseMonster.statistics.dexterity),
                intelligence: new Statistic(baseMonster.statistics.intelligence),
                condition: new Statistic(baseMonster.statistics.condition),
                attack: new Statistic(baseMonster.statistics.attack),
                magicAttack: new Statistic(baseMonster.statistics.magicAttack),
                defense: new Statistic(baseMonster.statistics.defense),
                magicResist: new Statistic(baseMonster.statistics.magicResist),
                walkSpeed: new Statistic(baseMonster.statistics.walkSpeed),
                runSpeed: new Statistic(baseMonster.statistics.runSpeed),
                attackRange: new Statistic(baseMonster.statistics.attackRange),
                attackSpeed: new Statistic(baseMonster.statistics.attackSpeed),
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
                    x: character.position.x - 2,
                    y: character.position.y - 2,
                    z: character.position.z,
                    r: character.position.r,
                    layer: character.position.layer,
                }
            })
        });

        session.send.chat({
            chatType: 6,
            senderId: data.senderId,
            senderName: data.senderName,
            receiverName: data.receiverName,
            text: `spawn [uid: ${monster.uid}, npcId: ${npcId}]`
        });
    }
    else if (data.text.includes('.itemget')) {
        let params = data.text.split(' ');

        let itemId = parseInt(params[1]);
        let itemStack = parseInt(params[2]);
        let itemPlus = parseInt(params[3]);

        let character = game.world.find('character', (ch) => ch.uid == data.senderId);

        let itemUid = await api.item.create({
            id: itemId,
            owner: character,
            stack: itemStack || 1,
            plus: itemPlus || 0,
            into: 'inventory'
        });

        // TODO: log and raise error message
        if (!itemUid)
            return;

        session.send.chat({
            chatType: 6,
            senderId: data.senderId,
            senderName: data.senderName,
            receiverName: data.receiverName,
            text: `itemget [uid: ${itemUid}, id: ${itemId}]`
        });
    }
    else if (data.text.includes('.itemdrop')) {
        let params = data.text.split(' ');

        let itemId = parseInt(params[1]);
        let itemStack = parseInt(params[2]);
        let itemPlus = parseInt(params[3]);

        if (!itemId)
            return;

        let character = game.world.find('character', (ch) => ch.uid == data.senderId);

        let itemUid = await api.item.create({
            id: itemId,
            owner: character,
            stack: itemStack || 1,
            plus: itemPlus || 0
        });

        // TODO: log and raise error message
        if (!itemUid)
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
            text: `itemdrop [uid: ${itemUid}, id: ${itemId}]`
        });
    }
    else if (data.text.includes('.search item')) {
        let params = data.text.split(' ');
        let items = game.content.filter('item', (i) => i.name.toLowerCase().includes(params[2].toLowerCase()))

        for (let item of items) {
            session.send.chat({
                chatType: 0,
                senderId: -1,
                senderName: '',
                receiverName: data.receiverName,
                text: `ID: ${item.id} [${item.name}]`
            });
        }
    }
    else if (data.text.includes('.levelup')) {
        let newLevel = Number(data.text.split(' ')[1]);

        if (newLevel) {
            if (newLevel < 1 || newLevel > 1000)
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
