import log from '@local/shared/logger';
import app from '../app';
import Monster from '../gameobject/monster';
import Character from '../gameobject/character';
import game from '../game';

export default function (session, msg) {
    let data = {
        attackerObjType: msg.read('u8') as number,
        attackerIndex: msg.read('i32>') as number,
        targetObjType: msg.read('u8') as number,
        targetIndex: msg.read('i32>') as number,
        attackType: msg.read('u8') as number,
        multicount: msg.read('u8') as number,
    };

    log.debug(`[ATTACK] (uid: ${data.attackerIndex} >> uid: ${data.targetIndex})`);

    let character = game.world.find('character', (ch) => ch.uid == data.attackerIndex) as Character;
    let monster = game.world.find('monster', (m) => m.uid == data.targetIndex) as Monster;

    if (!monster) {
        return console.debug(`monster which doesn't exist has been attacked`);
    }

    monster.attackable.damage(character);
}
