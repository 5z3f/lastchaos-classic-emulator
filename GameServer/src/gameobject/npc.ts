import log from '@local/shared/logger';
import util from '../util';

import GameObject from './index';
import Attackable from './traits/attackable';
import { Position } from '../types';
import { Statistic } from '../types/statistic';

import Session from '@local/shared/session';

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
    mana: Statistic,
    stamina: Statistic,
    defense: Statistic,
    attack: Statistic,
    magicAttack: Statistic,
    healthRegen: Statistic,
    manaRegen: Statistic,
    condition: Statistic,
}

type NPCOptions = {
    uid?: number,
    id: number,
    level: number,
    statistics: Statistics,
    reward: Reward,
    position: Position,
};

class NPC extends GameObject {
    attackable;

    type: string = 'npc';
    objType: number = 1;

    level: number;

    reward: Reward;

    constructor({ uid, id, level, statistics, reward, position }: NPCOptions) {
        // get all properties from GameObject class
        // @ts-ignore
        super(...arguments);

        this.attackable = new Attackable(this);
        this.type = 'npc';
        this.objType = 1;

        this.level = level;

        this.reward = {
            experience: reward?.experience || 0,
            gold: reward?.gold || 0,
            items: reward?.items || [],
        };

        Object.assign(this.statistics, statistics, this.statistics);
    }

    appear(session: Session) {
        session.send.appear('npc', {
            uid: this.uid,
            appeared: !!this.appearCount,
            id: this.id,
            zoneId: this.zone.id,
            areaId: this.areaId,
            position: this.position,
            health: this.statistics.health.getCurrentValue(),
            maxHealth: this.statistics.maxHealth.getCurrentValue(),
        });

        // TODO: appearedFirstTime should indicate whether the object appeared for the first time
        this.event.emit('appear', /* appearedFirstTime */);
    }

    disappear(session: Session) {
        session.send.disappear({
            objType: 1,
            uid: this.uid
        });

        // TODO: disappearedFirstTime should indicate whether the object disappeared for the first time
        this.event.emit('disappear', /* disappearedFirstTime */);
    }

    update({ session, type, data }: { session: Session, type: string, data: any }) {
        if (type == 'position') {
            Object.assign(this.position, data);

            session.send.move({
                objType: 1,
                uid: this.uid,
                moveType: 1, // TODO
                runSpeed: this.statistics.runSpeed,
                position: this.position
            })

            this.event.emit('move', data);
        }

        this.event.emit('update', data);
    };
}

export default NPC;
