const Database = require("./database");
const World = require("./world");

class game {
    static encryption = false; // TODO: move this
    static packDefault = true; // TODO: move this

    static initialize() {
        this.database = new Database();
        this.world = new World();
    }
}

module.exports = game;
