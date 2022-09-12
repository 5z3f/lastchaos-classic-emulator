
const BaseObject = require('./index');

const BaseItem = class extends BaseObject
{
    constructor({ id, name, description, enabled, type, subType, flags, jobFlag, wearingPosition, level, weight, price, durability, values })
    {
        super(...arguments)

        this.type = type;
        this.subType = subType;

        this.jobFlag = jobFlag;

        this.wearingPosition = wearingPosition;
        this.level = level;
        this.weight = weight;
        this.price = price;
        this.durability = durability;
        this.values = values || [ 0, 0, 0, 0, 0];
    }
}

module.exports = BaseItem;