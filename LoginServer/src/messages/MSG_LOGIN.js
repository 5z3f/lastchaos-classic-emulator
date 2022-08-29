const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');
const LCCrypt = require('@local/shared/LCCrypt');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        data = {
            'version': receivedMsg.read('u32>'),
            'mode': receivedMsg.read('u8'),
            'username': receivedMsg.read('stringnt'),
            'password': receivedMsg.read('stringnt'),
            'nation': receivedMsg.read('u8')
        }

        log.data(`[IN]  >> Received client login request: [ver: ${ data.version }, username: ${ data.username }, password: ${ data.password }, nation: ${ data.nation }`);

        const serverInfoMessage = () => {
            // MSG_LOGINSERV_PLAYER
            var msg = new message({ type: 0x22 });
    
            msg.write('i32>', 1);                   // recentServer
            msg.write('i32>', 1);                   // recentSubNum
            msg.write('i32>', 1);                   // connectorCount
            msg.write('i32>', 1);                   // connectorId
            msg.write('i32>', 1);                   // serverNo
            msg.write('i32>', 1);                   // maxServer
            msg.write('u8', 1);                     // recommendServer
            msg.write('i32>', 1);                   // serverSubNo
            msg.write('i32>', 50 + 1999);           // playerCount
            msg.write('stringnt', '127.0.0.1');     // ipAddress
            msg.write('i32>', 4190);                // port
        
            return msg.build({ });
        };

        log.data(`[OUT] << 'MSG_LOGINSERV_PLAYER' (0x22)`);
        server.send(serverInfoMessage());
    }
};