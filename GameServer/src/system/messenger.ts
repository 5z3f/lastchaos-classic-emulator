import log from "@local/shared/logger";

class Invite {
    static invites = [];

    static create(requester, receiver) {
        this.invites.push({
            requester,
            receiver,
            acceptedAt: null,
            createdAt: new Date()
        });

        log.info(`A new friend request has been made. [${requester} -> ${receiver}]`);
    }

    static accept(receiver) {
        const index = this.invites.findIndex((i) => i.receiver === receiver);

        if (index === -1)
            return false;

        this.invites[index].acceptedAt = new Date();
        let invite = this.invites[index];

        log.info(`Friend request from ${this.invites[index].requester} to ${receiver} has been accepted`);
        this.invites.splice(index, 1);

        return invite;
    }

    static find(receiver) {
        return this.invites.find((i) => i.receiver === receiver);
    }

    static cancel(receiver) {
        const index = this.invites.findIndex((i) => i.receiver === receiver);

        if (index === -1)
            return false;

        this.invites.splice(index, 1);
        log.info(`Friend request from ${this.invites[index].requester} to ${receiver} has been cancelled`);
        return true;
    }
}


class Messenger {
    static invite = Invite;
}

export default Messenger;