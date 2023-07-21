
import Zone from './zone';

class World {

    zones: Zone[] = [];

    constructor() {
        // add juno
        this.zones.push(new Zone(0, 1536, 1536));
    }

    add({ type, zoneId, data }) {
        if (type == 'zone') {
            this.zones.push(data);
        }
        else if (['character', 'monster', 'npc', 'item'].includes(type)) {
            let zone = this.get('zone', zoneId);
            zone.add(type, data);
        }
    }

    get(type, id) {
        if (type == 'zone')
            for (let zone of this.zones)
                if (zone.id == id)
                    return zone;
    }

    filter(type, opts) {
        let results = [];

        for (let zone of this.zones)
            results = [...results, ...zone.filter(type, opts)]

        return results;
    }

    find(type, opts) {
        let result;

        for (let zone of this.zones) {
            result = zone.find(type, opts);
            if (result)
                break;
        }

        return result;
    }

    remove({ type, zoneId }, opts) {
        for (let zone of this.zones) {
            if (zone.id == zoneId)
                zone.remove(type, opts);
        }
    }
}

export default World;
