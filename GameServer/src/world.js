
const Zone = require('./zone');

const World = class
{
    constructor()
    {
        this.zones = [];

        // add juno
        this.zones.push(new Zone(0, 1536, 1536));
    }

    add({ type, zoneId, data })
    {
        if(type == 'zone') {
            this.zones.push(data);
        }
        else if([ 'character', 'monster', 'npc', 'item' ].includes(type))
        {
            let zone = this.get('zone', zoneId);
            zone.add(type, data);
        }
    }

    get(type, id)
    {
        if(type == 'zone')
            for (var zone of this.zones) 
                if(zone.id == id)
                    return zone;
    }

    filter(type, opts)
    {
        var results = [];

        for(let zone of this.zones)
            results = [...results, ...zone.filter(type, opts)]

        return results;
    }

    find(type, opts)
    {
        var result = null;

        for(let zone of this.zones) {
            result = zone.find(type, opts);
            if(result != null)
                break;
        }

        return result;
    }

    remove({ type, zoneId }, opts)
    {
        for(let zone of this.zones) {
            if(zone.id == zoneId)
                zone.remove(type, opts);
        }
    }
}

module.exports = World;