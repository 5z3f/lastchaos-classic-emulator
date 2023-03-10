const bcrypt = require('bcrypt');
const log = require('@local/shared/logger');

class accounts {
    constructor(db) {
        this.db = db;
    }

    async getByCredentials(username, password) {
        try {
            const [dbAccount] = await this.db.query("SELECT * FROM accounts WHERE username = ?", [username]);

            if(await bcrypt.compare(password, dbAccount.hash))
                return dbAccount;

            return false;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async getCharacters(accountId) {
        try {
            const dbCharacters = await this.db.query("SELECT * FROM characters WHERE accountId = ?", [accountId]);
            return dbCharacters;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }
}

module.exports = accounts;