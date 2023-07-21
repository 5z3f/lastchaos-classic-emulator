
import server from '@local/shared/server';
import app from './app';
import handlers from './handlers';
import senders from './senders';

let srv = new server({
    host: app.config.gameserver.host,
    port: app.config.gameserver.port,
    handlers,
    senders,
});
