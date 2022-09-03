const EventEmitter = require('events');

const { Position, Statistic } = require('../types');
const game = require('../game');
const log = require("@local/shared/logger");

const Character = class
{
    constructor({ session, progress, stats, reward, ...opts })
    {
        this.session = session;

        this.uid = this.session.uid;
        this.id = 0;  // character database id

        this.nickname = "";

        this.progress = {
            level: 1,
            experience: 500000,
            maxExperience: 23223182, // probably will be removed later (?)
            skillpoint: 10000
        };

        this.classType = 1;
        this.jobType = 0;

        this.hairType = 1;
        this.faceType = 1;

        this.position = new Position();

        this.zoneId = 0;
        this.areaId = 0;

        // TODO: rename
        this.pkName = 0; // TODO: represent as string
        this.pkPenalty = 0;
        this.pkCount = 0;
        
        this.reputation = 0;

        // TODO: rename
        this.meracJoinFlag = 0;
        this.mapAttr = 0;

        this.statistics = 
        {            
            health:             new Statistic(100),
            maxHealth:          new Statistic(1000),
            mana:               new Statistic(100),
            maxMana:            new Statistic(1000),

            strength:           new Statistic(0),
            dexterity:          new Statistic(0),
            intelligence:       new Statistic(0),
            condition:          new Statistic(0),

            strengthAdded:      new Statistic(0),
            dexterityAdded:     new Statistic(0),
            intelligenceAdded:  new Statistic(0),
            conditionAdded:     new Statistic(0),


            attack:             new Statistic(100),
            magicAttack:        new Statistic(100),
            
            defense:            new Statistic(100),
            magicResist:        new Statistic(100),

            walkSpeed:          new Statistic(8.0),
            runSpeed:           new Statistic(15.0),

            attackRange:        new Statistic(2.3),

            attackSpeed:        new Statistic(10),
            magicSpeed:         new Statistic(0),
            
            skillSpeed:         new Statistic(1)
        };

        this.weight = 3000;         // TODO: move it
        this.maxWeight = 150000;    // TODO: move it

        this.reward = {
            experience: 0,
            gold:       0,
            items:      null
        };

        if(progress != undefined)
            Object.assign(this.progress, progress);

        if(stats != undefined)
            Object.assign(this.statistics, stats);

        if(reward != undefined)
            Object.assign(this.reward, reward);

        if(opts != undefined)
            Object.assign(this, opts);

        this.event = new EventEmitter();
    }

    update = (type, data) =>
    {
        if(type == 'position')
        {
            // FIXME: implement error handling
            if(data != undefined)                
                Object.assign(this.position, data);

            // TODO: send it in area
            // this.session.send.move({
            //     objType: 0,
            //     uid: this.uid,
            //     moveType: 1, // TODO
            //     speed: this.statistics.runSpeed,
            //     position: this.position
            // });

            this.event.emit('move', data);
        }
        else if(type == 'stats')
        {
            // FIXME: implement error handling
            if(data != undefined)                
                Object.assign(this.statistics, data);

            this.session.send.status({
                level: this.progress.level,
                experience: this.progress.experience,
                maxExperience: this.progress.maxExperience,
                health: this.statistics.health,
                maxHealth: this.statistics.maxHealth,
                mana: this.statistics.mana,
                maxMana: this.statistics.maxMana,
                strength: this.statistics.strength,
                dexterity: this.statistics.dexterity,
                intelligence: this.statistics.intelligence,
                condition: this.statistics.condition,
                strengthAdded: this.statistics.strengthAdded, // TODO:
                dexterityAdded: this.statistics.dexterityAdded, // TODO:
                intelligenceAdded: this.statistics.intelligenceAdded, // TODO:
                conditionAdded: this.statistics.conditionAdded, // TODO:
                attack: this.statistics.attack,
                magicAttack: this.statistics.magicAttack,
                defense: this.statistics.defense,
                magicResist: this.statistics.magicResist,
                skillpoint: this.progress.skillpoint,
                weight: this.weight,
                maxWeight: this.maxWeight,
                walkSpeed: this.statistics.walkSpeed,
                runSpeed: this.statistics.runSpeed,
                attackSpeed: this.statistics.attackSpeed,
                magicSpeed: this.statistics.magicSpeed,
                pkName: this.pkName,
                pkPenalty: this.pkPenalty,
                pkCount: this.pkCount,
                reputation: this.reputation,
                attackRange: this.statistics.attackRange,
                meracJoinFlag: this.meracJoinFlag,
                skillSpeed: this.statistics.skillSpeed,
                mapAttr: this.mapAttr
            });
        }

        this.event.emit('update', data);
    };

    spawn = () => {
        log.data(`[INFO] Spawning Character (uid: ${ this.uid }, id: ${ this.id }, zone: ${ this.zoneId })`);

        this.session.send.at({
            uid: this.uid,
            name: this.nickname,
            classType: this.classType,
            jobType: this.jobType,
            hairType: this.hairType,
            faceType: this.faceType,
            zoneId: this.zoneId,
            areaId: this.areaId,
            position: this.position
        });

        game.add({ type: 'character', zoneId: this.zoneId, data: this });

        // send stats to client
        this.update('stats');
    }
}

module.exports = Character;