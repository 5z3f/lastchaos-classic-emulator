import net from 'net';
import log from '@local/shared/logger';
import Session from '@local/shared/session';

type serverOptions = {
    host?: string,
    port?: number,
    handlers: any,
    senders: any,
    world?: any
};

class Server {
    host: string;
    port: number;
    sessions: Session[];

    //static World = null;
    constructor({ host, port, handlers, senders, world = undefined }: serverOptions) {
        let that = this;

        this.host = host || '127.0.0.1';
        this.port = port || 43594;

        // hold current sessions
        this.sessions = [];

        // hold game data
        // this.World = world || null;

        const srv = net.createServer();

        srv.on('connection', (socket) => {
            let session = new Session({
                server: that,
                socket: socket,
                handlers: handlers,
                senders: senders
            });

            this.sessions.push(session);
        });

        srv.listen(this.port, this.host, () => {
            log.info(`Server started listening on ${this.host}:${this.port}`)
        });
    }

    // remove existing session
    session = {
        remove: (uid: number) => { delete this.sessions[uid]; },
        //find: (cb: (element: session, index: number, array: session[]) => session, thisArg?: any) => this.sessions.find(cb)
    }
}

export default Server;
