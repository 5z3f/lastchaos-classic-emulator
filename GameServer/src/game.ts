import Content from "./content";
import World from "./world";

class game {
    static encryption = false; // TODO: move this
    static packDefault = true; // TODO: move this

    static content: Content;
    static world: World;

    static initialize() {
        this.content = new Content();
        this.world = new World();
        return this;
    }

    static sendInArea(zone, position, msgType, msgData) {
        let characters = this.world.filter('character', (ch) => ch.zone.id == zone.id && ch.distance(position) < 250);
        let objectPoints = zone.getObjectsInArea(position.x, position.y, 250).filter((o) => o.character);

        for (let obj of objectPoints) {
            obj.character.session.send[msgType](msgData);
        }

        //for (let ch of characters) {
        //    ch.session.send[msgType](msgData);
        //}
    }
}

export default game;
