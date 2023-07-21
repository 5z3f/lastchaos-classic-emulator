
import config from '../../servers.config.json';
import db from '@local/shared/db';
import database from './database';
import game from './game';

export default {
    config,
    dbc: db.initialize(),
    database,
    game: game.initialize(),
};
