const Zone = class
{
    npcs = [];
    monsters = [];
    characters = [];
    items = []; // on ground

    constructor(id) {
        this.id = id ?? -1;
        // this.attributeMap = null;
        //this.load();
    }

    add(type, data)
    {
        // return if object doesn't have unique identifier
        if(!('uid' in data))
            return;
            
        switch(type)
        {
            case 'character':
                var found = this.characters.findIndex((ch) => ch.uid == data.uid);
                
                if(found != -1)
                    return;

                this.characters.push(data);
                break;
            case 'npc':
                var found = this.npcs.findIndex((n) => n.uid == data.uid);
                
                if(found != -1)
                    return;

                this.npcs.push(data);
                break;
            case 'monster':
                var found = this.npcs.findIndex((m) => m.uid == data.uid);

                if(found != -1)
                    return;

                this.monsters.push(data);
                break;
            case 'item':
                var found = this.npcs.findIndex((i) => i.uid == data.uid);
                
                if(found != -1)
                    return;

                this.items.push(data);
                break;
        }
    }

    find(type, opts)
    {
        var result = null;

        switch(type)
        {
            case 'character':
                result = this.characters.find(opts);
                break;
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

    // TODO: this is not the best way, but sufficient for now
    remove(type, opts)
    {
        switch(type)
        {
            case 'character':
                this.characters = this.characters.filter(opts);
                break;
            case 'npc':
                this.npcs = this.npcs.filter(opts);
                break;
            case 'monster':
                this.monsters = this.monsters.filter(opts);
                break;
            case 'item':
                this.items = this.items.filter(opts);
                break;
        }
    }

    // load()
    // {
    // }
}

module.exports = Zone;