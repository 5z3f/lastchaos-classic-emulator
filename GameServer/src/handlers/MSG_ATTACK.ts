import log from '@local/shared/logger';
import Monster from '../gameobject/monster';
import Character from '../gameobject/character';
import game from '../game';
import Message from '@local/shared/message';
import Session from '@local/shared/session';
import { SendersType } from '../senders';
import { GameObjectType } from '../gameobject';

export default function (session: Session<SendersType>, msg: Message) {
    let data = {
        attackerObjType: msg.read('u8'),
        attackerIndex: msg.read('i32>'),
        targetObjType: msg.read('u8'),
        targetIndex: msg.read('i32>'),
        attackType: msg.read('u8'),
        multicount: msg.read('u8'),
    };

    log.debug(`[ATTACK] (uid: ${data.attackerIndex} >> uid: ${data.targetIndex})`);

    const character = game.world.find(GameObjectType.Character, (ch) => ch.uid == data.attackerIndex) as Character;
    const monster = game.world.find(GameObjectType.Monster, (m) => m.uid == data.targetIndex) as Monster;

    if (!monster) {
        return console.debug(`monster which doesn't exist has been attacked`);
    }

    monster.attackable.damage(character);
}
