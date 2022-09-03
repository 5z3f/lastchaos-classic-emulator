const EventEmitter = require('events');

const { Position, Statistic } = require('../types');
const game = require('../game');
const util = require('../util');
const log = require("@local/shared/logger");

const NPC = class //extends Object
{
    constructor({ uid, id, stats, reward, position })
    {
        this.uid = uid || util.generateId();   // unique id
        this.id = id;

        this.level = 1;

        this.position = position || new Position();
        this.zoneId = 0;
        this.areaId = 0;

        this.statistics = 
        {            
            health:         new Statistic(100),
            maxHealth:      new Statistic(1000),
            mana:           new Statistic(100),
            maxMana:        new Statistic(1000),

            walkSpeed:      new Statistic(8.0),
            runSpeed:       new Statistic(15.0),
        };

        // if argument `stats` is not undefined then update statistics data with given info
        if(stats != undefined)
            Object.assign(this.statistics, stats);

        this.event = new EventEmitter();
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
                runSpeed: this.stats.runSpeed,
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

    appear = (session) =>
    {
        log.data(`[INFO] Spawning NPC [uid: ${ this.uid }, id: ${ this.id }, zone: ${ this.zoneId }]`);
            
        session.send.appear('npc', { 
            uid: this.uid, 
            isNew: true, 
            id: this.id,
            zoneId: this.zoneId,
            areaId: this.areaId,
            position: position
        });
    }
}

module.exports = NPC;