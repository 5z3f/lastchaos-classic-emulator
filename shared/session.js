const farmhash = require('farmhash');

const message = require('@local/shared/message');
const log = require("@local/shared/logger");
const game = require('../GameServer/src/game'); // TODO: move this

const session = class
{
    constructor({ server, socket, handlers, senders })
    {
        this.server = server;
        this.socket = socket;

        this.uid = parseInt(farmhash.hash32(this.socket.remoteAddress + Date.now()) / 200);

        this.handlers = handlers;
        this.send = senders({ session: this });

        log.info(`New session: ${ this.toString() }`);

        const listen = () => 
        {
            var that = this;
    
            this.socket.on('data', (data) =>
            {
                var msg = new message({ buffer: data });
                var id = game.packDefault ? msg.read('u8') & 0x3f : msg.read('u8');
                
                // TODO: restrict access to all packets except '0x03' if client is not logged in
                if(id in that.handlers)
                    that.handlers[id](that, msg);
                else {
                    log.info(`Received unknown message: ${ id }`);
                    log.info(`Buffer: ${ msg.toString() }`)
                }
            });
        
            this.socket.on('error', (err) => {
                console.error(that.toString(), err);
            });

            this.socket.on('close', () => {
                log.info(`Session disconnected: ${ that.toString() }`);
            })
        }

        listen();
    }

    write = (buffer) => {
        this.socket.write(buffer);
    }

    close = () => {
        this.socket.destroy();
        this.server.session.remove(this.uid);
    }

    toString = () => `uid: ${ this.uid }, address: ${ this.socket.remoteAddress }:${ this.socket.remotePort }`;
}

module.exports = session;