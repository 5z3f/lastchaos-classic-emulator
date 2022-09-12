const log = require('@local/shared/logger');
const server = require("@local/shared/server");

global.game = require("./game");
global.game.initialize();

var srv = new server({
    host:       '127.0.0.1',
    port:       4190,
    handlers:   require("./handlers"),
    senders:    require("./senders")
});
