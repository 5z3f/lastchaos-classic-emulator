const Database = require("./database");
const World = require("./world");

class game {
    static encryption = false; // TODO: move this
    static packDefault = true; // TODO: move this

    static initialize() {
        this.database = new Database();
        this.world = new World();
    }

    static sendInArea(zone, position, msgType, msgData) {
        //var characters = this.world.filter('character', (ch) => ch.zone.id == zone.id && ch.distance(position) < 250);
        var objectPoints = zone.getObjectInArea(position.x, position.y, 250);

        for(var obj of objectPoints) {
            if(obj.type == 'character') {
                if(!obj.character) {
                    // TODO: fix this one
                    continue;
                }

                obj.character.send(msgType, msgData);
            }
        }
    }
}

module.exports = game;
