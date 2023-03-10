const log = require('../logger');

class characters {
    constructor(db) {
        this.db = db;
    }

    async getById(id) {
        try {
            const [result] = await this.db.query("SELECT * FROM characters WHERE id = ?", [id]);
            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async getByAccountId(accountId) {
        try {
            const result = await this.db.query("SELECT * FROM characters WHERE accountId = ?", [accountId]);
            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async getInventoryItems(charId) {
        try {
            const result = await this.db.query("SELECT * FROM items WHERE charId = ? AND place = 1", [charId]);
            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async getWearingItems(charId) {
        try {
            const result = await this.db.query("SELECT * FROM items WHERE charId = ? AND place = 1 AND wearingPosition IS NOT NULL", [charId]);
            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async increaseStatistic(charId, statpointName) {
        try {
            const result = await this.db.query(`UPDATE characters SET \`${statpointName}\` = \`${statpointName}\` + 1, statpoints = statpoints - 1 WHERE id = ?`, [
                charId
            ]);
            
            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async exists(nickname) {
        try {
            const result = await this.db.query("SELECT * FROM characters WHERE nickname = ?", [nickname]);
            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async create({ accountId, nickname, classId, faceId, hairId }) {
        try {
            const result = await this.db.execute("INSERT INTO characters (accountId, nickname, class, face, hair) VALUES (?, ?, ?, ?, ?)", [
                accountId,
                nickname,
                classId,
                faceId,
                hairId
            ]);

            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }
}

module.exports = characters;