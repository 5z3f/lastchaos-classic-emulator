import log from '@local/shared/logger';

import Monster from '../gameobject/monster';
import { InventoryRow } from '../system/inventory';
import { Statistic, Modifier, ModifierType, ModifierOrigin } from '../types/statistic';
import Position from '../types/position';
import api from '../api';
import BaseMonster from '../baseobject/monster';
import Character from '../gameobject/character';
import game from '../game';
import { GameObjectEvents } from '../gameobject';
import Message from '@local/shared/message';
import Session from '@local/shared/session';
import { ContentType } from '../content';

export default async function (session: Session, msg: Message) {
    let data = {
        chatType: msg.read('u8'),
        senderId: msg.read('i32>'),
        senderName: msg.read('stringnt'),
        receiverName: msg.read('stringnt'),
        text: msg.read('stringnt'),
    };

    if (data.text.includes('.speedup')) {
        let params = data.text.split(' ');
        let speed = parseFloat(params[1]);

        let runSpeedBefore = session.character.statistics.runSpeed.getTotalValue();

        session.character.statistics.runSpeed.addModifier(
            new Modifier(
                ModifierType.ADDITIVE,
                speed,
                ModifierOrigin.COMMAND
            )
        )

        session.character.statistics.runSpeed.set(speed);
        session.character.statistics.runSpeed.setMaxValue(speed);

        session.send.chat({
            chatType: 6,
            senderId: data.senderId,
            senderName: data.senderName,
            receiverName: data.receiverName,
            text: `speedup [uid: ${session.character.uid}] (before: ${runSpeedBefore}, after: ${session.character.statistics.runSpeed.getTotalValue()})`
        });

        // update character stats
        session.character.updateStatistics();
    }
    else if (data.text.includes('.spawn')) {
        let params = data.text.split(' ');
        let npcId = parseInt(params[1]);

        // find monster from database by id
        let baseMonster = game.content.monsters.find((m) => m.id == npcId);

        console.log('baseMonster', baseMonster);
        if (!baseMonster)
            return;

        let monster = new Monster({
            id: baseMonster.id,
            flags: baseMonster.flags,
            level: baseMonster.level,
            zone: session.character.zone,
            position: session.character.position,
            respawnTime: 0, // TODO:
            //@ts-ignore
            statistics: {
                health: new Statistic(baseMonster.statistics.health),
                maxHealth: new Statistic(baseMonster.statistics.health),
                mana: new Statistic(baseMonster.statistics.mana),
                maxMana: new Statistic(baseMonster.statistics.mana),
                attack: new Statistic(baseMonster.statistics.attack),
                magicAttack: new Statistic(baseMonster.statistics.magicAttack),
                defense: new Statistic(baseMonster.statistics.defense),
                magicResist: new Statistic(baseMonster.statistics.magicResist),
                walkSpeed: new Statistic(baseMonster.statistics.walkSpeed),
                runSpeed: new Statistic(baseMonster.statistics.runSpeed),
                attackRange: new Statistic(baseMonster.statistics.attackRange),
                attackSpeed: new Statistic(baseMonster.statistics.attackSpeed),
            },
            statpoints: {
                strength: baseMonster.statistics.strength,
                dexterity: baseMonster.statistics.dexterity,
                intelligence: baseMonster.statistics.intelligence,
                condition: baseMonster.statistics.condition,
            }
        });

        game.world.add({ type: 'monster', zoneId: 0, data: monster });
        monster.appear(session.character);

        session.character.on(GameObjectEvents.Move, (pos) => {
            session.send.move({
                objType: 1,
                moveType: 1,
                uid: monster.uid,
                speed: 5,
                position: {
                    x: session.character.position.x - 2,
                    y: session.character.position.y - 2,
                    z: session.character.position.z,
                    r: session.character.position.r,
                    layer: session.character.position.layer,
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

        let itemUid = await api.item.create({
            id: itemId,
            owner: session.character,
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

        let itemUid = await api.item.create({
            id: itemId,
            owner: session.character,
            stack: itemStack || 1,
            plus: itemPlus || 0
        });

        // TODO: log and raise error message
        if (!itemUid)
            return;

        session.character.session.send.item('MSG_ITEM_DROP', {
            uid: itemUid,
            id: itemId,
            stack: itemStack || 1,
            position: session.character.position,
            objType: 1,
            objUid: session.character.uid
        });

        session.character.session.send.chat({
            chatType: 6,
            senderId: session.character.uid,
            senderName: session.character.nickname,
            receiverName: session.character.nickname,
            text: `itemdrop [uid: ${itemUid}, id: ${itemId}]`
        });
    }
    else if (data.text.includes('.search item')) {
        let params = data.text.split(' ');
        let items = game.content.filter(ContentType.ITEM, (i) => i.name.toLowerCase().includes(params[2].toLowerCase()))

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
