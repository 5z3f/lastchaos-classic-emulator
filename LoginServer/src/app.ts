
import config from '../../servers.config.json';
import db from '@local/shared/db';
import database from './database';

export default {
    config,
    dbc: db.initialize(),
    database,
};
