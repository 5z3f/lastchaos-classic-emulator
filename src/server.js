const net = require('net');
const handler = require('./handler');
const log = require('./log');

const connection = {
    'enablished': false,
    'socket': null
}

const server =
{
    mount: (host, port) =>
    {
        const srv = net.createServer();

        srv.on('connection', (socket) => {
            log.info(`Incoming connection from ${ socket.remoteAddress }:${ socket.remotePort }`);
            
            var toGameServer = false;

            if(!connection.enablished) connection.enablished = true;
            else                       toGameServer = true;

            connection.socket = socket;

            socket.on('data', (data) => {
                handler.on('data', data, toGameServer);
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