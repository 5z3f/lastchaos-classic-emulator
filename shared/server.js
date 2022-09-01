const net = require('net');
const log = require('@local/shared/logger');
const session = require('@local/shared/session');

const server = class
{
    constructor({ host, port, handlers, senders })
    {
        var that = this;

        this.host = host ?? '127.0.0.1';
        this.port = port ??  43594;

        // hold current sessions
        this.sessions = [];

        // hold game data
        // this.gamedata = new GameData();

        const srv = net.createServer();
    
        srv.on('connection', (socket) =>
        {            
            var sess = new session({
                server: that,
                socket: socket,
                handlers: handlers,
                senders: senders
            });

            that.sessions[sess.uid] = sess;
        });
    
        srv.listen(this.port, this.host, () => {
            log.info(`Server started listening on ${ this.host }:${ this.port }`)
        });
    }

    // remove existing session
    session = { 
        remove: (uid) => { delete this.sessions[uid]; }
    }
}

module.exports = server;