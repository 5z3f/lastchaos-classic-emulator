import log from '@local/shared/logger';
import util from '../util';

import GameObject from './index';
import Attackable from './traits/attackable';

class NPC extends GameObject {
    attackable = new Attackable();

    constructor({ uid, id, level, statistics, reward, position }) {
        // get all properties from GameObject class
        super(...arguments);

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

    appear(session) {
        session.send.appear('npc', {
            uid: this.uid,
            appeared: this.appeared,
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

    disappear(session) {
        session.send.disappear({
            objType: 1,
            uid: this.uid
        });

        // TODO: disappearedFirstTime should indicate whether the object disappeared for the first time
        this.event.emit('disappear', /* disappearedFirstTime */);
    }

    update({ session, type, data }) {
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
