const EventEmitter = require('events');
const { Statistic, Position } = require('../types');
const util = require('../util');

class GameObject {

    constructor({ uid, id, flags, zone, position, areaId }) {
        this.uid = uid || util.generateId();   // unique id
        this.id = id;

        this.flags = flags;

        this.position = new Position(position || {});
        this.previousPosition = this.position.clone();
        this.originalPosition = this.position.clone();
        
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

        this.statistics = {            
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

    hasFlag = (flag) =>
        this.flags.includes(flag);

    canMove = () =>
        !this.state.dead && !this.state.inCombat() && this.hasFlag('MOVING');

    distance = (position) =>
        Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2));

    updatePosition({ position, moveType }) {
        // set previous position
        this.previousPosition = new Position(this.position);

        // update current position
        Object.assign(this.position, position);

        global.game.sendInArea(this.zone, this.position, 'move', {
            objType: 1,
            uid: this.uid,
            moveType: moveType,
            speed: !!moveType ? this.statistics.runSpeed.total : this.statistics.walkSpeed.total,
            position: this.position
        })
        
        // remove last position
        this.zone.quadTree.remove({ x: this.previousPosition.x, y: this.previousPosition.y, uid: this.uid });

        // insert updated position
        this.zone.quadTree.insert({
            x: this.position.x,
            y: this.position.y,
            uid: this.uid,
            type: 'monster',
        });

        this.event.emit('move', this.position);
    };

    testMoveInRange(range) {
        // if object has MOVING flag, then it can move
        if(!this.hasFlag('MOVING'))
            return;

        var randomMovementTick = util.getRandomInt(3, 15) * 1000;

        setInterval(function(that, range) {
            var randomMoveType = util.getRandomInt(0, 2);
			
			if (!that.canMove())
                return;

            var newPosition = that.originalPosition.getRandomWithinRange(50);
            newPosition.z = that.zone.getHeight(newPosition);
            var posAttr = that.zone.getAttribute(newPosition);

            while(posAttr == 255 /* BLOCK */) {
                newPosition = that.originalPosition.getRandomWithinRange(50);
                newPosition.z = that.zone.getHeight(newPosition);
                posAttr = that.zone.getAttribute(newPosition);
            }
    
            that.updatePosition({
                position: newPosition,
                moveType: randomMoveType,
            });

        }, randomMovementTick, this, range);
    }

    testRegenInRange(range) {
        var regenTick = 1 * 100;
            
        setInterval(function(that, range) {
            if(that.state.dead || that.statistics.health.total == that.statistics.maxHealth.total)
                return;

            if(that.statistics.health.total < that.statistics.maxHealth.total)
                that.statistics.health.total += 1;

            if(that.statistics.health.total > that.statistics.maxHealth.total)
                that.statistics.health.total = that.statistics.maxHealth.total;

            global.game.sendInArea(that.zone, that.position, 'objectstatus', {
                type: 1,
                uid: that.uid,
                health: that.statistics.health.total,
                maxHealth: that.statistics.maxHealth.total,
                mana: that.statistics.mana.total,
                maxMana: that.statistics.maxMana.total
            });

        }, regenTick, this, range);
    }
}

module.exports = GameObject;
