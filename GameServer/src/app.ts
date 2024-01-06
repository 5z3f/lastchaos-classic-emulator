import db from '@local/shared/db';
import config from '../../servers.config.json';
import game from './game';
import { Pool } from 'mariadb';

export default class App {
    static config = config; // FIXME: type this properly
    static dbc: Pool;
    static game: typeof game;

    static initialize() {
        this.dbc = db.initialize();
        this.game = game.initialize();
    }
}
