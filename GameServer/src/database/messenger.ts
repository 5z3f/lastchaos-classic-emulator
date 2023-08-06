import app from "../app";

import log from '@local/shared/logger';

type friendRequest = {
    requester: number,
    receiver: number,
    acceptedAt: Date,
    createdAt: Date
};

class messenger {

    static async createFriend({ requester, receiver, acceptedAt, createdAt }: friendRequest) {
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
