const Item = require("./object/item");

const Database = class
{
    constructor() {
        this.items = [];
        this.monsters = [];
        this.npcs = [];

        this.load('items');
    }

    load(type)
    {
        if(type == 'items')
        {
            const items = require('../data/item_test.json');

            for(var i in items)
            {
                if(items[i].name.length < 1 || items[i].description.length < 1)
                    continue;

                this.items.push(new Item(items[i]));
            }
        }
    }

    find(type, opts)
    {
        var result = null;

        switch(type)
        {
            case 'npc':
                result = this.npcs.find(opts);
                break;
            case 'monster':
                result = this.monsters.find(opts);
                break;
            case 'item':
                result = this.items.find(opts);
                break;
        }

        return result;
    }
}

module.exports = Database;