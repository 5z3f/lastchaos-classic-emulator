
const Item = class
{
    constructor({ uid, id })
    {
        this.uid = uid || util.generateId();   // unique id
        this.id = id;

        this.name = "";
        this.type = 0;
        this.subType = 0;
        this.level = 1;
        this.enable = 1;
        this.flag = 0;
        this.jobFlag = 0;
        this.wearingPosition = 255;
        this.weight = 0;
        this.price = 0;
    }
}

module.exports = Item;