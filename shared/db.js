const mysql = require('mysql2/promise');
const log = require('./logger');
require('dotenv').config();

class db {
    static #config = {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 100,
        multipleStatements: true
    }

    static #pool;

    static async initialize() {
        if (this.#pool)
            return;

        try {
            this.#pool = mysql.createPool(this.#config);
            await this.#pool.getConnection();
            log.info('Database connection established')
        } catch (err) {
            log.error(err)                
            throw err;
        }
    }

    static async query(sql, params) {
        const conn = await this.#pool.getConnection(this.#config);

        try {
            const [results] = await conn.query(sql, params);
            return results;
        } finally {
            conn.release();
        }
    }

    static async execute(sql, params) {
        const conn = await this.#pool.getConnection(this.#config);

        try {
            const [result] = await conn.execute(sql, params);
            return result;
        } finally {
            conn.release();
        }
    }

    static accounts = new (require('./database/accounts'))(this);
    static characters = new (require('./database/characters'))(this);
    static items = new (require('./database/items'))(this);
    static messenger = new (require('./database/messenger'))(this);
}

module.exports = db;