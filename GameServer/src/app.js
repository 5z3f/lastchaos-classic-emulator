const db = require('@local/shared/db');
const server = require('@local/shared/server');

// set our configuration as global
global.config = require('../../servers.config.json');

// initialize database connection pool
db.initialize();

// set game data as global for easier access
global.game = require('./game');

// initialize game
game.initialize();

global.server = new server({
    host:       config.gameserver.host,
    port:       config.gameserver.port,
    handlers:   require('./handlers'),
    senders:    require('./senders')
});
