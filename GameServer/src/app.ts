
import config from '../../servers.config.json';
import game from './game';
import { Pool } from 'mariadb';

class App {
    static config = config;
    static dbc: Pool;
    static game: typeof game;
};

console.log('App', App);
export default App;
