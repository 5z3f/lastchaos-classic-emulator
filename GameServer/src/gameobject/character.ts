import log from '@local/shared/logger';

import util from '../util';

import { Statistic, Modifier, ModifierType, ModifierOrigin } from '../types/statistic';
import { Inventory } from '../system/inventory';

import GameObject from './index';
import Attackable from './traits/attackable';

class Character extends GameObject {
    attackable = new Attackable();

    constructor({ session, uid, id, classType, jobType, nickname, appearance, progress, reward, reputation, statistics, role = 'user' }) {
        // get all properties from GameObject class
        super(...arguments);

        this.type = 'character';
        this.objType = 0;

        this.session = session;

        // TODO: roles
        this.role = role;

        this.nickname = nickname || '';

        this.classType = classType ?? 0;
        this.jobType = jobType ?? 0;

        this.appearance = {
            hairType: appearance?.hairType || 1,
            faceType: appearance?.faceType || 1
        };

        this.statistics = {
            ...this.statistics,

            magicSpeed: new Statistic(1),
            skillSpeed: new Statistic(1),

            // FIXME: not sure if this can be mixed with other, proper stat classes...
            statpoints: 0,
            strengthAdded: 0,
            dexterityAdded: 0,
            intelligenceAdded: 0,
            conditionAdded: 0,
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
            character: [],
            npc: [],
            monster: [],
            item: []
        }

        // TODO: buffs / debuffs
        this.buffs = [];

        Object.assign(this.statistics, statistics, this.statistics);

        const baseCharacterStatistics = require('../../data/characters.json')[this.classType].baseStatistics;

        this.statistics.health = new Statistic(baseCharacterStatistics.health);
        this.statistics.maxHealth = new Statistic(baseCharacterStatistics.health);
        this.statistics.healthRegen = new Statistic(baseCharacterStatistics.healthRegen);
        this.statistics.mana = new Statistic(baseCharacterStatistics.mana);
        this.statistics.maxMana = new Statistic(baseCharacterStatistics.mana);
        this.statistics.manaRegen = new Statistic(baseCharacterStatistics.manaRegen);
        this.statistics.strength = new Statistic(baseCharacterStatistics.strength);
        this.statistics.strength = new Statistic(baseCharacterStatistics.strength);
        this.statistics.dexterity = new Statistic(baseCharacterStatistics.dexterity);
        this.statistics.intelligence = new Statistic(baseCharacterStatistics.intelligence);
        this.statistics.condition = new Statistic(baseCharacterStatistics.condition);
        this.statistics.attack = new Statistic(baseCharacterStatistics.attack);
        this.statistics.magicAttack = new Statistic(baseCharacterStatistics.magicAttack);
        this.statistics.defense = new Statistic(baseCharacterStatistics.defense);
        this.statistics.magicResist = new Statistic(baseCharacterStatistics.magicResist);
        this.statistics.walkSpeed = new Statistic(baseCharacterStatistics.walkSpeed);
        this.statistics.attackRange = new Statistic(baseCharacterStatistics.attackRange);
        this.statistics.attackSpeed = new Statistic(baseCharacterStatistics.attackSpeed);

        this.tmpEventHandler();
    }

    tmpEventHandler() {
        this.event.on('inventory-equip', (row) => {
            this.updateStatistics();
        });

        this.event.on('inventory-unequip', (row) => {
            this.updateStatistics();
        });

        this.event.on('heal', (data) => {
            this.updateStatistics();
        })
    }

    addVisibleObject(type, uid) {
        if (!this.visibleObjectUids[type].includes(uid))
            this.visibleObjectUids[type].push(uid);
    }

    removeVisibleObject(type, uid) {
        let objArray = this.visibleObjectUids[type];
        if (objArray.includes(uid))
            objArray.splice(objArray.indexOf(uid), 1);
    }

    getVisibleObjects(type) {
        return this.visibleObjectUids[type];
    }

    isObjectVisible(type, uid) {
        return this.visibleObjectUids[type].includes(uid);
    }


    calculateStatpoints() {
        this.statistics.strength.increase(this.statistics.strengthAdded);
        this.statistics.dexterity.increase(this.statistics.dexterityAdded);
        this.statistics.intelligence.increase(this.statistics.intelligenceAdded);
        this.statistics.condition.increase(this.statistics.conditionAdded);

        const ClassType = {
            Titan: 0,
            Knight: 1,
            Healer: 2,
            Mage: 3,
            Rogue: 4,
            Sorcerer: 5
        }

        // TODO: Will also need to take into account the current total of given statistic
        function calculateBonusHealth(classType, level, str, dex, int, con, multiplier) {
            switch (classType) {
                case ClassType.Titan:
                    multiplier = 1.1;
                    break;
                case ClassType.Knight:
                    multiplier = 1.2;
                    break;
                case ClassType.Healer:
                case ClassType.Rogue:
                    multiplier = 0.9;
                    break;
                case ClassType.Mage:
                case ClassType.Sorcerer:
                    multiplier = 0.8;
                    break;
            }

            return Math.floor((con + (str * 0.5) + (dex * 0.2) + (int * 0.1) + (con * 0.7) + (level * 0.9)) * multiplier);
        }

        function calculateBonusMana(classType, level, str, dex, int, con, multiplier) {
            switch (classType) {
                case ClassType.Titan:
                    multiplier = 0.4;
                    break;
                case ClassType.Knight:
                    multiplier = 0.6;
                    break;
                case ClassType.Healer:
                case ClassType.Rogue:
                    multiplier = 0.8;
                    break;
                case ClassType.Mage:
                    multiplier = 1.4;
                    break;
                case ClassType.Sorcerer:
                    multiplier = 1.2;
                    break;
            }

            return Math.floor((int + (str * 0.1) + (dex * 0.2) + (int * 0.9) + (con * 0.2) + (level * 1.2)) * multiplier);
        }

        function calculateBonusAttack(classType, level, str, dex, int, con) {
            let bonus = 0;

            switch (classType) {
                case ClassType.Titan:
                    bonus = (str + (str * 1.5) + (dex * 0.1) + (int * 0.1) + (con * 0.6) + (level * 0.3));
                    break;
                case ClassType.Knight:
                    bonus = (str + (str * 1.1) + (dex * 0.4) + (int * 0.1) + (con * 0.3) + (level * 0.5));
                    break;
                case ClassType.Healer:
                    bonus = (dex + (str * 0.5) + (dex * 1.2) + (int * 0.3) + (con * 0.5) + (level * 0.8));
                    break;
                case ClassType.Rogue:
                    bonus = (dex + (str * 0.3) + (dex * 0.9) + (int * 0.1) + (con * 0.3) + (level * 0.4));
                    break;
                case ClassType.Mage:
                    bonus = (int + (str * 0.1) + (dex * 0.3) + (int * 1.4) + (con * 0.1) + (level * 1.2));
                    break;
                case ClassType.Sorcerer:
                    bonus = (int + (str * 0.1) + (dex * 0.3) + (int * 1.2) + (con * 0.4) + (level * 0.9));
                    break;
            }

            return bonus;
        }

        let bonusHealth = calculateBonusHealth(
            this.classType,
            this.progress.level,
            this.statistics.strength.getCurrentValue(),
            this.statistics.dexterity.getCurrentValue(),
            this.statistics.intelligence.getCurrentValue(),
            this.statistics.condition.getCurrentValue(),
            1 // multiplier
        );

        let bonusMana = calculateBonusMana(
            this.classType,
            this.progress.level,
            this.statistics.strength.getCurrentValue(),
            this.statistics.dexterity.getCurrentValue(),
            this.statistics.intelligence.getCurrentValue(),
            this.statistics.condition.getCurrentValue(),
            1 // multiplier
        );

        let bonusAttack = calculateBonusAttack(
            this.classType,
            this.progress.level,
            this.statistics.strength.getCurrentValue(),
            this.statistics.dexterity.getCurrentValue(),
            this.statistics.intelligence.getCurrentValue(),
            this.statistics.condition.getCurrentValue()
        );

        this.statistics.maxHealth.addModifier(
            new Modifier(ModifierType.ADDITIVE, bonusHealth)
        );

        this.statistics.maxMana.addModifier(
            new Modifier(ModifierType.ADDITIVE, bonusMana)
        );

        this.statistics.attack.addModifier(
            new Modifier(ModifierType.ADDITIVE, bonusAttack)
        );
    }

    calculateWearingItems() {
        // value * pow(plusFactor, plus)
        const plusFormula = (staticValue, plus) =>
            staticValue * Math.pow((plus >= 11) ? 1.07 : 1.06, plus);

        const WearingPosition = {
            NONE: 255, // TODO: change to -1 and convert it on the packet receive/send handler
            Helmet: 0,
            Shirt: 1,
            Weapon: 2,
            Pants: 3,
            Shield: 4,
            Gloves: 5,
            Boots: 6,
            Accesory1: 7,
            Accesory2: 8,
            Accesory3: 9,
            Pet: 10
        };

        // TODO: bloodseal system

        let wearingRows = this.inventory.filter(0, (r) => r?.wearingPosition != 255 && r?.wearingPosition != undefined)

        for (let row of wearingRows) {
            switch (row.item.wearingPosition) {
                case WearingPosition.Helmet:
                case WearingPosition.Shirt:
                case WearingPosition.Pants:
                case WearingPosition.Shield:
                case WearingPosition.Gloves:
                case WearingPosition.Boots:
                    let itemDefense = row.item.values[0];
                    let itemMagicResist = row.item.values[1];

                    this.statistics.defense.addModifier(
                        new Modifier(ModifierType.ADDITIVE,
                            /* standard formula */ plusFormula(itemDefense, row.plus) +
                            /* 10 additional defense */ (row.plus >= 8 ? 10 : 0) +
                            /* max plus bonus */ (row.plus >= 15 ? 100 : 0),
                            ModifierOrigin.ITEM,
                            row.item.id
                        )
                    );

                    this.statistics.magicResist.addModifier(
                        new Modifier(ModifierType.ADDITIVE,
                                    /* standard formula */ plusFormula(itemMagicResist, row.plus) +
                                    /* 10 additional magic resist */ (row.plus >= 10 ? 10 : 0) +
                                    /* max plus bonus */ (row.plus >= 15 ? 100 : 0),
                            ModifierOrigin.ITEM,
                            row.item.id
                        )
                    );
                    break;
                case WearingPosition.Weapon:
                    let itemAttack = row.item.values[0];
                    let totalItemAttack = plusFormula(itemAttack, row.plus) + (row.plus >= 15 ? 75 : 0);

                    this.statistics.attack.addModifier(
                        new Modifier(ModifierType.ADDITIVE, totalItemAttack, ModifierOrigin.ITEM, row.item.id)
                    );

                    if (this.progress.level < row.item.level) {
                        let levelDiff = row.item.level - this.progress.level;

                        if (levelDiff <= 4)
                            break;

                        let penaltyInPercent = (levelDiff > 12) ? .90 : (levelDiff > 8) ? .70 : (levelDiff > 4) ? .50 : 0;

                        this.statistics.attack.addModifier(
                            new Modifier(ModifierType.NEGATIVE, (totalItemAttack * penaltyInPercent), ModifierOrigin.ITEM, row.item.id)
                        );
                    }
                    break;
            }
        }
    }

    calculateStatus() {
        // reset all statistics to its base state, except current health and mana
        for (let key in this.statistics)
            if (this.statistics.hasOwnProperty(key) && this.statistics[key] instanceof Statistic && (key != 'health' && key != 'mana'))
                this.statistics[key].reset();

        // TODO: statistics
        // TODO: wearing items
        // TODO: passive skills
        // TODO: buffs/debuffs

        this.calculateStatpoints();
        this.calculateWearingItems();
    }

    updateStatistics(data) {
        Object.assign(this.statistics, data);

        this.calculateStatus();

        // TODO: All packet sending related functions should be separated from GameObject classes (I think)
        this.session.send.status({
            ...this.statistics,
            ...this.progress,
            pkName: this.pk.name,
            pkPenalty: this.pk.penalty,
            pkCount: this.pk.count,
            reputation: this.reputation,
            meracJoinFlag: this.meracJoinFlag,
            mapAttr: this.mapAttr,
            weight: 3000,
            maxWeight: 10000
        });

        this.event.emit('update-statistics', data);
    }

    spawn() {
        log.data(`[INFO] Spawning Character (uid: ${this.uid}, id: ${this.id}, zone: ${this.zone.id})`);

        this.zone.add('character', this);

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

        // send remaining statpoints
        this.session.send.statpoint(0, { points: this.statistics.statpoints });

        // TODO: spawnedFirstTime should indicate whether the object spawned for the first time
        this.event.emit('spawn', /* spawnedFirstTime */);
    }
}

export default Character;
