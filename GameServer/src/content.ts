import BaseItem from './baseobject/item';
import BaseMonster from './baseobject/monster';
import BaseNPC from './baseobject/npc';

export enum ContentType {
    ITEM,
    MONSTER,
    NPC
}

class content {
    items: BaseItem[] = [];
    monsters: BaseMonster[] = [];
    npcs: BaseNPC[] = [];

    constructor() {
        this.load(ContentType.ITEM, '../data/items.json');
        this.load(ContentType.MONSTER, '../data/monsters.json');
        this.load(ContentType.NPC, '../data/npcs.json');
    }

    load(type: ContentType, fp: string) {
        const objs = require(fp);

        for (let o of objs) {
            if (!o.enabled)
                continue;

            if (o.name.length < 1 /*|| o.description.length < 1*/)
                continue;

            switch (type) {
                case ContentType.ITEM:
                    this.items.push(new BaseItem(o));
                    break;
                case ContentType.MONSTER:
                    this.monsters.push(new BaseMonster(o));
                    break;
                case ContentType.NPC:
                    this.npcs.push(new BaseNPC(o));
                    break;
            }
        }

    }

    /**
     * 
     * @depracated
     */
    find(type: ContentType, opts: any) {
        switch (type) {
            case ContentType.ITEM:
                return this.items.find(opts);
            case ContentType.MONSTER:
                return this.monsters.find(opts);
            case ContentType.NPC:
                return this.npcs.find(opts);
        }
    }

    /**
     * 
     * @depracated
     */
    filter(type: ContentType, opts: any) {
        switch (type) {
            case ContentType.ITEM:
                return this.items.filter(opts);
            case ContentType.MONSTER:
                return this.monsters.filter(opts);
            case ContentType.NPC:
                return this.npcs.filter(opts);
        }
    }
}

export default content;
