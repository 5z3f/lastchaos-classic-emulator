const Content = require("./content");
const World = require("./world");

class game {
    static encryption = false; // TODO: move this
    static packDefault = true; // TODO: move this

    static initialize() {
        this.content = new Content();
        this.world = new World();
    }

    static sendInArea(zone, position, msgType, msgData) {
        var characters = this.world.filter('character', (ch) => ch.zone.id == zone.id && ch.distance(position) < 250);
        var objectPoints = zone.getObjectsInArea(position.x, position.y, 250).filter((o) => o.character);

        for (var obj of objectPoints) {
            obj.character.session.send[msgType](msgData);
        }

       //for (var ch of characters) {
       //    ch.session.send[msgType](msgData);
       //}
    }
}

module.exports = game;
