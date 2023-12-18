
import Zone from './zone';

class World {
    zones: Zone[] = [];

    constructor() {
        // add juno
        this.zones.push(new Zone(0, 1536, 1536));
    }

    add({ type, zoneId, data }: { type: 'character' | 'npc' | 'monster' | 'item' | 'zone', zoneId?: number, data: any }) {
        if (type == 'zone') {
            this.zones.push(data);
        }
        else if (['character', 'monster', 'npc', 'item'].includes(type)) {
            if (zoneId == undefined)
                return;

            let zone = this.get('zone', zoneId);
            if (zone)
                zone.add(type, data);
        }
    }

    get(type: 'character' | 'npc' | 'monster' | 'item' | 'zone', id: number) {
        if (type == 'zone')
            for (let zone of this.zones)
                if (zone.id == id)
                    return zone;
    }

    filter<T>(type: 'character' | 'npc' | 'monster' | 'item', opts: Function) {
        let results: T[] = [];

        for (let zone of this.zones)
            results = [...results, ...zone.filter(type, opts)]

        return results;
    }

    find(type: 'character' | 'npc' | 'monster' | 'item', opts: Function) {
        let result;

        for (let zone of this.zones) {
            result = zone.find(type, opts);
            if (result)
                break;
        }

        return result;
    }

    remove({ type, zoneId }: { type: 'character' | 'npc' | 'monster' | 'item', zoneId: number }, opts: Function) {
        for (let zone of this.zones) {
            if (zone.id == zoneId)
                zone.remove(type, opts);
        }
    }
}

export default World;
