const BaseItem = require('./baseobject/item');
const BaseMonster = require('./baseobject/monster');
const BaseNPC = require('./baseobject/npc');

const Database = class
{
    constructor()
    {
        this.items = [];
        this.monsters = [];
        this.npcs = [];

        this.load('items', '../data/items.json');
        this.load('monsters', '../data/monsters.json');
        this.load('npcs', '../data/npcs.json');
    }

    load(type, fp)
    {
        const objs = require(fp);

        for(var o of objs)
        {
            if(!o.enabled)
                continue;

            if(o.name.length < 1 /*|| o.description.length < 1*/)
                continue;
            
            switch(type)
            {
                case 'items':
                    this.items.push(new BaseItem(o));
                    break;
                case 'monsters':
                    this.monsters.push(new BaseMonster(o));
                    break;
                case 'npcs':
                    this.npcs.push(new BaseNPC(o));
                    break;
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

    filter(type, opts)
    {
        var result = null;

        switch(type)
        {
            case 'npc':
                result = this.npcs.filter(opts);
                break;
            case 'monster':
                result = this.monsters.filter(opts);
                break;
            case 'item':
                result = this.items.filter(opts);
                break;
        }

        return result;
    }
}

module.exports = Database;