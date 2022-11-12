const log = require('@local/shared/logger');
const util = require('../util');

const GameObject = require('./index');
const Attackable = require('./traits/attackable');

class NPC extends util.extender(GameObject, Attackable) {
    constructor({ uid, id, level, statistics, reward, position }) {
        // get all properties from GameObject class
        super(...arguments);

        this.type = 'npc';
        this.level = level;

        this.reward = {
            experience: reward?.experience || 0,
            gold: reward?.gold || 0,
            items: reward?.items || []
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
            health: this.statistics.health.total,
            maxHealth: this.statistics.maxHealth.total
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
        if(type == 'position') {
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

module.exports = NPC;
