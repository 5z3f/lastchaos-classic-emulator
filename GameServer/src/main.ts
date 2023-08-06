
import server from '@local/shared/server';
import App from './app';
import handlers from './handlers';
import senders from './senders';

import config from '../../servers.config.json';
import db from '@local/shared/db';
import game from './game';

App.dbc = db.initialize();
App.game = game;
game.initialize();

let srv = new server({
    host: config.gameserver.host,
    port: config.gameserver.port,
    handlers,
    senders,
});
