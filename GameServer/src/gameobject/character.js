const log = require('@local/shared/logger');

const util = require('../util');

const { Statistic, Position } = require('../types');
const { Inventory } = require('../system/inventory');

const GameObject = require('./index');
const Attackable = require('./traits/attackable');

const Character = class extends util.extender(GameObject, Attackable)
{
    constructor({ session, uid, id, classType, jobType, nickname, appearance, progress, reward, reputation, statistics })
    {
        // get all properties from GameObject class
        super(...arguments);

        this.type = 'character';
        this.session = session;

        this.nickname = nickname || '';

        this.classType = classType ?? 1;
        this.jobType = jobType ?? 0;

        this.appearance = {
            hairType: appearance?.hairType || 1,
            faceType: appearance?.faceType || 1
        };

        this.statistics = {
            ...this.statistics,

            strengthAdded: new Statistic(1),
            dexterityAdded: new Statistic(1),
            intelligenceAdded: new Statistic(1),
            conditionAdded: new Statistic(1),

            magicSpeed: new Statistic(1),
            skillSpeed: new Statistic(1),
        }
        
        this.inventory = new Inventory({ owner: this });

        this.progress = {
            level: progress?.level || 1,
            experience: progress?.experience || 0,
            maxExperience: progress?.maxExperience || 23223182,
            skillpoint: progress?.skillpoint || 10000
        };

        this.reward = {
            experience: reward?.experience || 0,
            skillpoint: reward?.skillpoint || 0,
            gold: reward?.gold || 0,
            items: reward?.items || []
        };

        this.reputation = reputation ?? 0;

        // TODO: temporary
        this.pk = {
            name: 0,
            penalty: 0,
            count: 0
        };

        // TODO: rename
        this.meracJoinFlag = 0;
        this.mapAttr = 0;

        this.visibleObjectUids = {
            'character': [],
            'npc': [],
            'monster': [],
            'item': []
        }
        
        Object.assign(this.statistics, statistics, this.statistics);
    }

    send = (type, data) => {
        this.session.send[type](data);
    }

    addVisibleObject = (type, uid) => {
        if(!this.visibleObjectUids[type].includes(uid))
            this.visibleObjectUids[type].push(uid);
    }

    removeVisibleObject = (type, uid) => {
        var objArray = this.visibleObjectUids[type];
        if(objArray.includes(uid))
            objArray.splice(objArray.indexOf(uid), 1);
    }

    getVisibleObjects = (type) => {
        return this.visibleObjectUids[type];
    }

    isObjectVisible = (type, uid) => {
        return this.visibleObjectUids[type].includes(uid);
    }

    update = (type, data) =>
    {
        if(type == 'position')
        {
            this.previousPosition = this.position.clone();

            Object.assign(this.position, data);

            // TODO: send it in area
            // this.session.send.move({
            //     objType: 0,
            //     uid: this.uid,
            //     moveType: 1, // TODO
            //     speed: this.statistics.runSpeed,
            //     position: this.position
            // });
            
            // remove last position
            this.zone.quadTree.remove({ x: this.previousPosition.x, y: this.previousPosition.y, uid: this.uid });

            // insert updated position
            this.zone.quadTree.insert({
                x: this.position.x,
                y: this.position.y,
                uid: this.uid,
                type: 'character',
                character: this
            });

            log.data(`[MOVE] uid: ${ this.uid } [from: (${ this.previousPosition.toString() }, ${ this.zone.getAttribute(this.previousPosition, true) }) to (${ this.position.toString() }, ${ this.zone.getAttribute(this.position, true) })]`)

            this.event.emit('move', data);
        }
        else if(type == 'stats')
        {
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
                weight: this.inventory.weight,
                maxWeight: this.inventory.maxWeight,
                walkSpeed: this.statistics.walkSpeed,
                runSpeed: this.statistics.runSpeed,
                attackSpeed: this.statistics.attackSpeed,
                magicSpeed: this.statistics.magicSpeed,
                pkName: this.pk.name,
                pkPenalty: this.pk.penalty,
                pkCount: this.pk.count,
                reputation: this.reputation,
                attackRange: this.statistics.attackRange,
                meracJoinFlag: this.meracJoinFlag,
                skillSpeed: this.statistics.skillSpeed,
                mapAttr: this.mapAttr
            });
        }

        this.event.emit('update', data);
    };

    spawn = () =>
    {
        log.data(`[INFO] Spawning Character (uid: ${ this.uid }, id: ${ this.id }, zone: ${ this.zone.id })`);

        this.session.send.at({
            uid: this.uid,
            name: this.nickname,
            classType: this.classType,
            jobType: this.jobType,
            hairType: this.appearance.hairType,
            faceType: this.appearance.faceType,
            zoneId: this.zone.id,
            areaId: this.areaId,
            position: this.position
        });

        this.zone.add('character', this);
        
        //game.world.add({ type: 'character', zoneId: this.zone.id, data: this });

        // send stats to client
        this.update('stats');

        // TODO: spawnedFirstTime should indicate whether the object spawned for the first time
        this.event.emit('spawn', /* spawnedFirstTime */);
    }
}

module.exports = Character;