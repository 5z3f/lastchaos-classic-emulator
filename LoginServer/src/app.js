const server = require('@local/shared/server');
const db = require('@local/shared/db');

// set our configuration as global
global.config = require('../../servers.config.json');

// initialize database connection pool
db.initialize();

var srv = new server({
    host:       config.loginserver.host,
    port:       config.loginserver.port,
    handlers:   require('./handlers'),
    senders:    require('./senders')
});