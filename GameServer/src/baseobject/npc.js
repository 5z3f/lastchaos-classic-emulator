const BaseObject = require('./index');
const { Statistic, Modifier, ModifierType } = require('../types/statistic');

class BaseNPC extends BaseObject {

    constructor({ id, name, description, enabled, flags, level, vision, attackType, spawns, statistics, skills, reward }) {
        super(...arguments)

        this.level = level;
        this.vision = vision; // currently unused

        this.attackType = attackType; // melee, range or magic (0, 1, 2)

        this.statistics = {
            health:         0,
            mana:           0,
            strength:       0,
            dexterity:      0,
            intelligence:   0,
            condition:      0,
            attack:         0,
            magicAttack:    0,
            defense:        0,
            magicResist:    0,
            walkSpeed:      0,
            runSpeed:       0,
            attackRange:    0,
            attackSpeed:    0,
        };

        this.spawns = spawns;

        // [{ id, level, chance (in percent) }]
        this.skills = skills;

        this.reward = {
            experience: reward?.experience || 0,
            skillpoint: reward?.skillpoint || 0,
            gold: reward?.gold || 0,
            items: reward?.items || []
        };

        Object.assign(this.statistics, statistics, this.statistics);
        Object.assign(this.reward, reward, this.reward);
    }
}

module.exports = BaseNPC;
