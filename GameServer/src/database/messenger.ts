import app from "../app";

import log from '@local/shared/logger';

class messenger {

    static async createFriend({ requester, receiver, acceptedAt, createdAt }) {
        try {
            const result = await app.dbc.execute("INSERT INTO friends (requester, receiver, acceptedAt, createdAt) VALUES (?, ?, ?, ?)", [
                requester,
                receiver,
                acceptedAt,
                createdAt
            ]);

            return result;
        }
        catch (error) {
            log.error(error);
            return null;
        }
    }
}

export default messenger;
