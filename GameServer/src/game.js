const World = require("./world");
const Zone = require("./zone");

const game = class
{
    static encryption = false; // TODO: move this
    static packDefault = true; // TODO: move this

    static world = null;

    static initialize = () => {
        game.world = new World();
    }

    static add({ type, zoneId, data }) {
        game.world.add({ type: type, data: data, zoneId: zoneId })
    }

    static find(type, uid) {
        return game.world.find(type, uid)
    }

    static filter(type, opts) {
        return game.world.filter(type, opts)
    }
}

module.exports = game;