const EventEmitter = require('events');
const { Statistic, Modifier, ModifierType } = require('../types/statistic');
const Position = require('../types/position');
const util = require('../util');
const log = require('@local/shared/logger');

class GameObject {
    constructor({ uid, id, flags, zone, position, areaId }) {
        this.uid = uid || util.createSessionId();   // unique id
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

        this.firstAppearance = (this.appearCount === 0);

        this.state = {
            dead: false,
            inCombat: () => (performance.now() - this.lastAttackTime < 10000),
        }

        this.lastAttackTime = 0;

        this.statistics = {
            health:         new Statistic(),
            maxHealth:      new Statistic(),
            healthRegen:    new Statistic(),
            mana:           new Statistic(),
            maxMana:        new Statistic(),
            manaRegen:      new Statistic(),
            strength:       new Statistic(),
            dexterity:      new Statistic(),
            intelligence:   new Statistic(),
            condition:      new Statistic(),
            attack:         new Statistic(),
            magicAttack:    new Statistic(),
            defense:        new Statistic(),
            magicResist:    new Statistic(),
            walkSpeed:      new Statistic(),
            runSpeed:       new Statistic(),
            attackRange:    new Statistic(),
            attackSpeed:    new Statistic(),
        };

        this.event = new EventEmitter();
        
        this.startRegen();
    }

    die() {
        this.state.dead = true;
    }

    respawn() {
        this.statistics.health.reset()
        this.state.dead = false;

        this.respawnCount += 1;

        // temporary
        log.debug(`RESPAWNED UID: ${this.uid}`);

        this.appearInRange(50);

        this.event.emit('respawn');

    }

    hasFlag = (flag) =>
        this.flags.includes(flag);

    canMove = () =>
        !this.state.dead && !this.state.inCombat() && this.hasFlag('MOVING');

    distance = (position) =>
        Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2));

    updatePosition(position, moveType = 1) {
        // previous position
        this.previousPosition = this.position.clone();

        // update current position
        this.position = position;

        // remove previous position
        this.zone.quadTree.remove({
            x: this.previousPosition.x,
            y: this.previousPosition.y,
            uid: this.uid
        });

        // insert updated position
        var qtPointObj = {
            x: this.position.x,
            y: this.position.y,
            uid: this.uid,
            type: this.type
        }

        if(this.type === 'character')
            qtPointObj.character = this;

        this.zone.quadTree.insert(qtPointObj);

        this.event.emit('move', this.position);

        // FIXME: make it suitable for character class
        if(this.type == 'character') {
            log.debug(`[MOVE] UID: ${ this.uid } | (${this.previousPosition.toString()}, ${this.zone.getAttribute(this.previousPosition, true)}) --> (${this.position.toString()}, ${this.zone.getAttribute(this.position, true)})`)
            return;
        }

        global.game.sendInArea(this.zone, this.position, 'move', {
            objType: this.objType,
            uid: this.uid,
            moveType: moveType,
            speed: !!moveType ? this.statistics.runSpeed.getCurrentValue() : this.statistics.walkSpeed.getCurrentValue(),
            position: this.position
        });
    };

    startRegen() {
        var regenTick = 1 * 5000;

        this.regenInterval = setInterval(() => {
            const regenAmount = this.statistics.healthRegen.getCurrentValue();
            this.heal(regenAmount);
        }, regenTick);
    }

    heal(amount) {
        if (!amount || this.state.dead || this.statistics.health.getCurrentValue() == this.statistics.maxHealth.getCurrentValue())
            return;

        const currentHealth = this.statistics.health.getCurrentValue();
        const maxHealth = this.statistics.maxHealth.getCurrentValue();

        const newHealth = Math.min(currentHealth + amount, maxHealth);
        const healthDiff = newHealth - currentHealth;

        if (!healthDiff)
            return;
        
        this.statistics.health.set(newHealth);

        this.event.emit('heal', amount);
        // TODO: update character object in area
    }

    move(range) {
        var randomMoveType = util.getRandomInt(0, 2);

        if (!this.canMove())
            return;

        var newPosition = this.originalPosition.getRandomWithinRange(range);
        newPosition.z = this.zone.getHeight(newPosition);

        var posAttr = this.zone.getAttribute(newPosition);

        while (posAttr == 255 /* BLOCK */) {
            newPosition = this.originalPosition.getRandomWithinRange(range);
            newPosition.z = this.zone.getHeight(newPosition);
            posAttr = this.zone.getAttribute(newPosition);
        }

        this.updatePosition(newPosition, randomMoveType);
    }

    testMoveInRange(range) {
        // if object has MOVING flag, then it can move
        if (!this.hasFlag('MOVING'))
            return;

        var range = 50;
        var randomMovementTick = util.getRandomInt(3, 15) * 1000;

        setInterval(function(that) { that.move(range) }, randomMovementTick, this);
    }
}

module.exports = GameObject;
