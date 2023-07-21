import mariadb from 'mariadb';
import log from './logger';

import dotenv from 'dotenv';
dotenv.config();

class db {
    static #config: string | mariadb.PoolConfig = {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '3306'),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 100,
        multipleStatements: true
    }

    static pool: mariadb.Pool;

    static initialize() {
        this.pool = mariadb.createPool(this.#config);
        log.info('Database connection established');
        return this.pool;
    }
}

export default db;
