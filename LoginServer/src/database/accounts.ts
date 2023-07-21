//import bcrypt from 'bcrypt';
import crypto from 'crypto';
import log from '@local/shared/logger';
import app from '../app';

type account = {
    id: number;
    username: string;
    hash: string;
};

type character = {
    id: number;
    accountId: number;
    nickname: string;
    classId: number;
    faceId: number;
    hairId: number;
};

class accounts {
    static #salt = 'salty';

    static async getByCredentials(username: string, password: string) {
        try {
            const [dbAccount]: account[] = await app.dbc.query("SELECT * FROM accounts WHERE username = ?", [username]);

            //if (!(await bcrypt.compare(password, dbAccount.hash)))
            //    return false;
            let hashed = crypto.createHash('sha256').update(password + this.#salt).digest('hex');
            if (hashed != dbAccount.hash)
                return false;

            return dbAccount;
        }
        catch (error) {
            log.error(error);
            return null;
        }
    }

    static async getCharacters(accountId: number) {
        try {
            const dbCharacters: character[] = await app.dbc.query("SELECT * FROM characters WHERE accountId = ?", [accountId]);
            return dbCharacters;
        }
        catch (error) {
            log.error(error);
            return null;
        }
    }
}

export default accounts;
