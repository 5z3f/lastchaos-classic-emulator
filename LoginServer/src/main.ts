import server from '@local/shared/server';
import app from './app';
import handlers from './handlers';
import senders from './senders';

let srv = new server({
    host: app.config.loginserver.host,
    port: app.config.loginserver.port,
    handlers,
    senders,
});
