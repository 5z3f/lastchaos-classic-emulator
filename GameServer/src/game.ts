import Content from "./content";
import { Position } from "./types";
import World from "./world";
import Zone from "./zone";

import Character from "./gameobject/character";
import Invite from "./system/core/invite";
import { GameObjectType } from "./gameobject";

class game {
    static encryption = false; // TODO: move this
    static packDefault = true; // TODO: move this

    static content: Content;
    static world: World;

    // systems
    static invites: Invite[] = [];

    static initialize() {
        this.content = new Content();
        this.world = new World();
        
        return this;
    }

    static sendInArea(zone: Zone, position: Position, msgType: any, msgData: any) {
        let characters = this.world.filter(GameObjectType.Character, (ch: Character) => ch.zone.id == zone.id && ch.distance(position) < 250);

        //@ts-ignore
        let objectPoints = zone.getObjectsInArea(position.x, position.y, 250).filter((o) => o.character);

        for (let obj of objectPoints) {
            //@ts-ignore
            obj.character.session.send[msgType](msgData);
        }

        //for (let ch of characters) {
        //    ch.session.send[msgType](msgData);
        //}
    }
}

export default game;
