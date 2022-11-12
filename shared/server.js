const net = require('net');
const log = require('@local/shared/logger');
const session = require('@local/shared/session');

class server {
    //static World = null;
    constructor({ host, port, handlers, senders, world, encryption }) {
        var that = this;

        this.host = host || '127.0.0.1';
        this.port = port ||  43594;

        // hold current sessions
        this.sessions = [];

        // hold game data
        // this.World = world || null;

        const srv = net.createServer();
    
        srv.on('connection', (socket) => {     
            var sess = new session({
                server: that,
                socket: socket,
                handlers: handlers,
                senders: senders
            });

            this.sessions[sess.uid] = sess;
        });
    
        srv.listen(this.port, this.host, () => {
            log.info(`Server started listening on ${ this.host }:${ this.port }`)
        });
    }

    // remove existing session
    session = { 
        remove: (uid) => { delete server.sessions[uid]; }
    }
}

module.exports = server;
