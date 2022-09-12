const log = require('@local/shared/logger');
const { Position } = require('../types');
const util = require('../util');

const GameObject = require('./index');
const Attackable = require('./traits/attackable');
const { Vector2 } = require('three');


const Monster = class extends util.extender(GameObject, Attackable)
{
    constructor({ uid, id, zone, level, statistics, reward, position, respawnTime })
    {
        // get all properties from GameObject class
        super(...arguments);

        this.type = 'monster';
        this.level = level;

        this.reward = {
            experience: reward?.experience || 0,
            gold: reward?.gold || 0,
            items: reward?.items || []
        };

        this.respawnTime = /*respawnTime ||*/ 15 * 1000;

        this.testRegenInRange(250);
        this.testMoveInRange(250);
        
        Object.assign(this.statistics, statistics, this.statistics);
    }

    testMoveInRange = (range) =>
    {
        setInterval(function(that, range)
        {
            var characterPoints = that.zone.getObjectInArea(that.position.x, that.position.y, range)
                .filter(obj => obj.type === 'character');

            var moveType = util.getRandomInt(0, 1);
            var moveSpeed = !!moveType ? that.statistics.walkSpeed : that.statistics.runSpeed;
			
			if (that.state.dead || that.state.inCombat()) {
                return;
            }

            var newPosition = that.originalPosition.getRandomWithinRange(50);
            var posAttr = that.zone.getAttribute(newPosition.x, newPosition.y);

            while(posAttr == 'BLOCK')
            {
                newPosition = that.originalPosition.getRandomWithinRange(50);
                posAttr = that.zone.getAttribute(newPosition.x, newPosition.y);
            }

            that.position = newPosition;
    
            for(var obj of characterPoints)
            {
                obj.character.session.send.move({
                    objType: 1,
                    uid: that.uid,
                    moveType: moveType, // TODO
                    speed: moveSpeed.total + 4,
                    position: that.position
                })
            }
        }, util.getRandomInt(3, 15) * 1000, this, range);
    }

    testRegenInRange = (range) =>
    {
        setInterval(function(that, range)
        {
            var characterPoints = that.zone.getObjectInArea(that.position.x, that.position.y, range)
                .filter(obj => obj.type === 'character');

            for(var obj of characterPoints)
            {
                if(that.statistics.health.total > 0 && that.statistics.health.total < that.statistics.maxHealth.total)
                {
                    that.statistics.health.total += 20;

                    obj.character.session.send.objectstatus({
                        type: 1,
                        uid: that.uid,
                        health: that.statistics.health,
                        maxHealth: that.statistics.maxHealth,
                        mana: that.statistics.mana,
                        maxMana: that.statistics.maxMana
                    });
                }
            }

        }, 1000, this, range);
    }

    appear = (character) =>
    {
        if(this.state.dead)
            return;
        
        character.session.send.appear('monster', {
            uid: this.uid, 
            firstAppearance: this.firstAppearance, // TODO:
            id: this.id,
            zoneId: this.zone.id,
            areaId: this.areaId,
            position: this.position,
            health: this.statistics.health,
            maxHealth: this.statistics.maxHealth
        });

        character.addVisibleObject('monster', this.uid);

        this.appearCount += 1;

        // TODO: appearedFirstTime should indicate whether the object appeared for the first time
        this.event.emit('appear', /* appearedFirstTime */);
    }
    
    appearInRange = (range) =>
    {
        var characterPoints = this.zone.getObjectInArea(this.position.x, this.position.y, range)
            .filter(obj => obj.type === 'character');

        for(var obj of characterPoints)
            this.appear(obj.character);
    }

    disappear = (character) =>
    {
        if(this.state.dead)
            return;

        character.session.send.disappear({
            objType: 1,
            uid: this.uid
        });

        character.removeVisibleObject('monster', this.uid);

        // TODO: disappearedFirstTime should indicate whether the object disappeared for the first time
        this.event.emit('disappear', /* disappearedFirstTime */);
    }

    die = () =>
    {
        this.state.dead = true;

        setTimeout(function(that)
        {
            that.statistics.health.total = that.statistics.maxHealth.total;
            that.state.dead = false;

            that.respawnCount += 1;

            // temporary
            console.log('respawned', that.uid);
            that.appearInRange(50);

            that.event.emit('respawn');

        }, this.respawnTime, this);

        this.event.emit('die');
    }

    update = ({ session, type, data }) =>
    {
        if(type == 'position')
        {
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

module.exports = Monster;