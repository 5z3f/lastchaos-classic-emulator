import BaseItem from './baseobject/item';
import BaseMonster from './baseobject/monster';
import BaseNPC from './baseobject/npc';

class content {

    items: BaseItem[] = [];
    monsters: BaseMonster[] = [];
    npcs: BaseNPC[] = [];

    constructor() {
        this.load('items', '../data/items.json');
        this.load('monsters', '../data/monsters.json');
        this.load('npcs', '../data/npcs.json');
    }

    load(type, fp) {
        const objs = require(fp);

        for (let o of objs) {
            if (!o.enabled)
                continue;

            if (o.name.length < 1 /*|| o.description.length < 1*/)
                continue;

            switch (type) {
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
        switch (type) {
            case 'npc':
                return this.npcs.find(opts);
            case 'monster':
                return this.monsters.find(opts);
            case 'item':
                return this.items.find(opts);
        }
    }

    filter(type, opts) {
        switch (type) {
            case 'npc':
                return this.npcs.filter(opts);
            case 'monster':
                return this.monsters.filter(opts);
            case 'item':
                return this.items.filter(opts);
        }
    }
}

export default content;
