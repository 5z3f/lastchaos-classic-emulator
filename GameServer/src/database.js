const BaseItem = require('./baseobject/item');
const BaseMonster = require('./baseobject/monster');
const BaseNPC = require('./baseobject/npc');

class Database {

    items = [];
    monsters = [];
    npcs = [];

    constructor() {
        this.load('items', '../data/items.json');
        this.load('monsters', '../data/monsters.json');
        this.load('npcs', '../data/npcs.json');
    }

    load(type, fp) {
        const objs = require(fp);

        for(var o of objs) {
            if(!o.enabled)
                continue;

            if(o.name.length < 1 /*|| o.description.length < 1*/)
                continue;
            
            switch(type) {
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

    find(type, opts) {
        switch(type) {
            case 'npc':
                return this.npcs.find(opts);
            case 'monster':
                return this.monsters.find(opts);
            case 'item':
                return this.items.find(opts);
        }
    }

    filter(type, opts) {
        switch(type) {
            case 'npc':
                return this.npcs.filter(opts);
            case 'monster':
                return this.monsters.filter(opts);
            case 'item':
                return this.items.filter(opts);
        }
    }
}

module.exports = Database;
