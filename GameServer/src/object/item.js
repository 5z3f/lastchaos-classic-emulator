const Item = class
{
    constructor({ id, name, description, enable, type, subType, flag, jobFlag, wearingPosition, level, weight, price, durability, values })
    {
        this.id = id;

        this.enabled = !!enable;

        this.name = name;
        this.description = description;

        this.type = type;
        this.subType = subType;
        this.flag = flag;
        this.jobFlag = jobFlag;
        this.wearingPosition = wearingPosition;
        this.level = level;
        this.weight = weight;
        this.price = price;
        this.durability = durability;
        this.values = values || [ 0, 0, 0, 0, 0];
    }
}


module.exports = Item;