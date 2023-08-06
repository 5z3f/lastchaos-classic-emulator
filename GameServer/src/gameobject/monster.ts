import log from '@local/shared/logger';
import { Position } from '../types';
import util from '../util';

import GameObject from './index';
import Attackable from './traits/attackable';
import { Vector2 } from 'three';
import Zone from '../zone';
import Character from './character';
import { Statistic } from '../types/statistic';

type Reward = {
    experience: number,
    gold: number,
    items: number[],
};

type Statistics = {
    strength: Statistic,
    dexterity: Statistic,
    intelligence: Statistic,
    health: Statistic,
    maxHealth: Statistic,
    mana: Statistic,
    maxMana: Statistic,
    stamina: Statistic,
    defense: Statistic,
    attack: Statistic,
    magicAttack: Statistic,
    magicResist: Statistic,
    healthRegen: Statistic,
    manaRegen: Statistic,
    condition: Statistic,

    walkSpeed: Statistic,
    runSpeed: Statistic,
    attackRange: Statistic,
    attackSpeed: Statistic
}

type MonsterOptions = {
    uid?: number,
    id: number,
    zone: Zone,
    flags: string[],
    level: number,
    statistics: Statistics,
    reward: Reward,
    position: Position,
    respawnTime: number,
};


class Monster extends GameObject {
    attackable;

    type: string = 'monster';
    objType: number = 1;

    level: number;

    reward: Reward;

    respawnTime: number;


    constructor({ uid, id, zone, flags, level, statistics, reward, position, respawnTime }: MonsterOptions) {
        // get all properties from GameObject class
        // @ts-ignore
        super(...arguments);

        this.attackable = new Attackable(this);
        this.type = 'monster';
        this.objType = 1;

        this.level = level;

        this.reward = {
            experience: reward?.experience || 0,
            gold: reward?.gold || 0,
            items: reward?.items || [],
        };

        this.respawnTime = /*respawnTime ||*/ 15 * 1000;

        this.testMoveInRange(250);

        Object.assign(this.statistics, statistics, this.statistics);
    }

    appear(character: Character) {
        if (this.state.dead)
            return;

        character.session.send.appear('monster', {
            uid: this.uid,
            firstAppearance: this.firstAppearance, // TODO:
            id: this.id,
            zoneId: this.zone.id,
            areaId: this.areaId,
            position: this.position,
            health: this.statistics.health.getCurrentValue(),
            maxHealth: this.statistics.maxHealth.getCurrentValue()
        });

        character.addVisibleObject('monster', this.uid);

        this.appearCount += 1;

        // TODO: appearedFirstTime should indicate whether the object appeared for the first time
        this.event.emit('appear', /* appearedFirstTime */);
    }

    appearInRange(range: number) {
        let characterPoints = this.zone.getObjectsInArea(this.position.x, this.position.y, range)
            .filter(obj => obj.type === 'character');

        for (let obj of characterPoints)
            if (obj.character)
                this.appear(obj.character);
    }

    disappear(character: Character) {
        if (this.state.dead)
            return;

        character.session.send.disappear({
            objType: 1,
            uid: this.uid
        });

        character.removeVisibleObject('monster', this.uid);

        // TODO: disappearedFirstTime should indicate whether the object disappeared for the first time
        this.event.emit('disappear', /* disappearedFirstTime */);
    }

    die() {
        super.die();
        setTimeout(() => this.respawn(), this.respawnTime);
        this.event.emit('die');
    }
}

export default Monster;