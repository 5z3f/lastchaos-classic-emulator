const EventEmitter = require('events');

const log = require('@local/shared/logger');

const { Position, Statistic } = require('../types');
const game = require('../game');
const util = require('../util');

const Monster = class
{
    constructor({ uid, stats, reward, position, ...opts })
    {
        this.uid = uid || util.generateId();   // unique id
        this.id = 0;

        this.level = 1;

        this.position = position || new Position();
        this.zoneId = 0;
        this.areaId = 0;

        this.flags = {
            visible: false
        }

        this.statistics = 
        {            
            health:         new Statistic(100),
            maxHealth:      new Statistic(1000),
            mana:           new Statistic(100),
            maxMana:        new Statistic(1000),

            strength:       new Statistic(0),
            dexterity:      new Statistic(0),
            intelligence:   new Statistic(0),
            condition:      new Statistic(0),

            attack:         new Statistic(100),
            magicAttack:    new Statistic(100),
            
            defense:        new Statistic(100),
            magicResist:    new Statistic(100),

            walkSpeed:      new Statistic(8.0),
            runSpeed:       new Statistic(15.0),

            attackRange:    new Statistic(2.3),

            attackSpeed:    new Statistic(10),
            magicSpeed:     new Statistic(0),
            
            skillSpeed:     new Statistic(1)
        };

        this.reward = {
            experience: 0,
            skillpoint: 0,
            gold:       0,
            items:      null
        };

        if(stats != undefined)
            Object.assign(this.statistics, stats);

        if(reward != undefined)
            Object.assign(this.reward, reward);
        
        if(opts != undefined)
            Object.assign(this, opts);

        this.event = new EventEmitter();
    }

    appear = (session) =>
    {
        log.data(`[INFO] Spawning Monster (uid: ${ this.uid }, id: ${ this.id }, zone: ${ this.zoneId })`);
            
        session.send.appear('monster', { 
            uid: this.uid, 
            isNew: true, 
            id: this.id,
            zoneId: this.zoneId,
            areaId: this.areaId,
            position: this.position
        });
    }

    update = ({ session, type, data }) =>
    {
        if(type == 'position')
        {
            // FIXME: implement error handling
            if(data != undefined)                
                Object.assign(this.position, data);

            session.send.move({
                objType: this.type,
                uid: this.uid,
                moveType: 1, // TODO
                runSpeed: this.statistics.runSpeed,
                position: this.position
            })

            this.event.emit('move', data);
        }
        else if(type == 'stats')
        {
            // FIXME: implement error handling
            if(data != undefined)                
                Object.assign(this.statistics, data);

            session.send.status(this.statistics);
        }
        
        this.event.emit('update', data);
    };
}

module.exports = Monster;