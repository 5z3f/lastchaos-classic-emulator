import util from '../GameServer/src/util'; // TODO: this
import Message from '@local/shared/message';
import log from "@local/shared/logger";
//import game from '../GameServer/src/game'; // TODO: move this
import Server from './server';
import net from 'net';

const game = {
    packDefault: true,
};

type sessionOptions = {
    server: Server,
    socket: net.Socket,
    handlers: any,
    senders: any,
};

class Session {
    server: Server;
    socket: net.Socket;

    // unique id (do not confuse with uid (user id) from database)
    uid;

    // database user account id
    accountId?: number = undefined;

    handlers: any;
    send: any;

    constructor({ server, socket, handlers, senders }: sessionOptions) {
        this.server = server;
        this.socket = socket;

        this.uid = util.createSessionId();

        this.handlers = handlers;
        this.send = senders(this);

        log.info(`New session: ${this.toString()}`);

        const listen = () => {
            let that = this;

            this.socket.on('data', (data) => {
                let msg = new Message({ buffer: data });
                let id = msg.read('u8') as number;
                if (game.packDefault)
                    id = id & 0x3f;

                // TODO: restrict access to all packets except '0x03' if client is not logged in
                let handler = that.handlers[id];
                if (!handler) {
                    log.info(`Received unknown message: ${id}`);
                    log.info(`Buffer: ${msg.toString()}`)
                    return;
                }

                handler(that, msg);
            });

            this.socket.on('error', (err) => {
                console.error(that.toString(), err);
            });

            this.socket.on('close', () => {
                log.info(`Session disconnected: ${that.toString()}`);
            })
        }

        listen();
    }

    write(buffer: string | Uint8Array) {
        this.socket.write(buffer);
    }

    close() {
        this.socket.destroy();
        this.server.session.remove(this.uid);
    }

    toString() {
        return `uid: ${this.uid}, address: ${this.socket.remoteAddress}:${this.socket.remotePort}`;
    }
}

export default Session;
