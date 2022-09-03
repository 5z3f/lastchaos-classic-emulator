const World = class
{
    constructor() {
        this.zones = [];
    }

    add({ type, zoneId, data })
    {
        if(type == 'zone') {
            this.zones.push(data);
        }
        else if([ 'character', 'monster', 'npc' ].includes(type))
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
            results.push({ zoneId: zone.id, result: zone.filter(type, opts) });

        return results;
    }

    find(type, uid)
    {
        var result = null;

        for(let zone of this.zones) {
            result = zone.find(type, uid);
            if(result != null)
                break;
        }

        return result;
    }
}

module.exports = World;