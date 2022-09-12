const EventEmitter = require('events');
const { Statistic, Position } = require('../types');
const util = require('../util');

const GameObject = class
{
    constructor({ uid, id, zone, position, zoneId, areaId })
    {
        this.uid = uid || util.generateId();   // unique id
        this.id = id;

        this.position = position || new Position();
        this.previousPosition = new Position(this.position);
        this.originalPosition = new Position(this.position);
        
        this.zone = zone;
        this.areaId = areaId;
    
        //this.visibleToSomeone = false;

        this.appearCount = 0;
        this.resurrectionCount = 0;

        this.firstAppearance = this.appearCount == 0 ? true : false;

        this.state = {
            dead: false,
            inCombat: () => (performance.now() - this.lastAttackTime < 10000),
        }

        this.lastAttackTime = 0;

        this.statistics = 
        {            
            health:         new Statistic(0),
            maxHealth:      new Statistic(0),
            mana:           new Statistic(0),
            maxMana:        new Statistic(0),
            strength:       new Statistic(0),
            dexterity:      new Statistic(0),
            intelligence:   new Statistic(0),
            condition:      new Statistic(0),
            attack:         new Statistic(0),
            magicAttack:    new Statistic(0),
            defense:        new Statistic(0),
            magicResist:    new Statistic(0),
            walkSpeed:      new Statistic(5),
            runSpeed:       new Statistic(5),
            attackRange:    new Statistic(0),
            attackSpeed:    new Statistic(0),
        };
        
        this.event = new EventEmitter();
    }
}

module.exports = GameObject;