
var NPC = require('./object/npc');
var { Position } = require('./types');

const Zone = class
{
    npcs = [];
    monsters = [];
    characters = [];
    items = []; // on ground

    constructor(id){
        this.id = id ?? -1;
        // this.attributeMap = null;
        //this.load();
    }

    add(type, data)
    {
        switch(type)
        {
            case 'character':
                this.characters.push(data);
                break;
            case 'npc':
                this.npcs.push(data);
                break;
            case 'monster':
                this.monsters.push(data)
                break;
            case 'item':
                this.items.push(data);
                break;
        }
    }

    find(type, uid)
    {
        var result = null;

        switch(type)
        {
            case 'character':
                result = this.characters.find(ch => ch.uid == uid)
                break;
            case 'npc':
                result = this.npcs.find(ch => ch.uid == uid)
                break;
            case 'monster':
                result = this.monsters.filter(opts);
                break;
            case 'item':
                result = this.items.find(ch => ch.uid == uid)
                break;
        }

        return result;
    }

    filter(type, opts)
    {
        var result = null;

        switch(type)
        {
            case 'character':
                result = this.characters.filter(opts);
                break;
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

    // load()
    // {
    // }
}

module.exports = Zone;