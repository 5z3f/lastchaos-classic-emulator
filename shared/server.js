const net = require('net');
const log = require('@local/shared/logger');

const connection = {
    'socket': null
}

const server =
{
    mount: (host, port, handler) =>
    {
        const srv = net.createServer();

        srv.on('connection', (socket) => {
            log.info(`Incoming connection from ${ socket.remoteAddress }:${ socket.remotePort }`);
            
            connection.socket = socket;

            socket.on('data', (data) => {
                handler.on('data', data);
            });
        });

        srv.listen(port, host, () => {
            log.info(`Server started listening on ${ host }:${ port }`)
        })
    },
    send: (buf) => {
        connection.socket.write(buf);
    }
}

module.exports = server;