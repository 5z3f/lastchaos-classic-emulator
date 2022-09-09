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
}

module.exports = game;