const log = require('@local/shared/logger');

class messenger {
    constructor(db) {
        this.db = db;
    }

    async createFriend({ requester, receiver, acceptedAt, createdAt }) {
        try {
            const result = await this.db.execute("INSERT INTO friends (requester, receiver, acceptedAt, createdAt) VALUES (?, ?, ?, ?)", [
                requester,
                receiver,
                acceptedAt,
                createdAt
            ]);

            return result;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }
}

module.exports = messenger;