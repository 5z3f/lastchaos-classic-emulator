const Database = require("./database");
const World = require("./world");

const game = class
{
    static encryption = false; // TODO: move this
    static packDefault = true; // TODO: move this

    static world = null;

    static initialize = () => {
        game.world = new World();
        game.database = new Database();
    }

    static add({ type, zoneId, data }) {
        game.world.add({ type: type, data: data, zoneId: zoneId })
    }

    static find(type, opts) {
        return game.world.find(type, opts)
    }

    static filter(type, opts) {
        return game.world.filter(type, opts)
    }
}

module.exports = game;