import bcrypt from 'bcrypt';
import log from '@local/shared/logger';
import app from '../app';

type DBAccount = {
    id: number;
    username: string;
    hash: string;
};

type DBCharacter = {
    id: number;
    accountId: number;
    nickname: string;
    classId: number;
    faceId: number;
    hairId: number;
};

class accounts {
    static async getByCredentials(username: string, password: string) {
        try {
            const [dbAccount]: DBAccount[] = await app.dbc.query("SELECT * FROM accounts WHERE username = ?", [username]);

            if (!(await bcrypt.compare(password, dbAccount.hash)))
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
            const dbCharacters: DBCharacter[] = await app.dbc.query("SELECT * FROM characters WHERE accountId = ?", [accountId]);
            return dbCharacters;
        }
        catch (error) {
            log.error(error);
            return null;
        }
    }
}

export default accounts;
