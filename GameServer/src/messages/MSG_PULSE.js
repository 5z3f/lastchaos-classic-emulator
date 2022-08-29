const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {        
        const pulseMessage = () => {
            var msg = new message({});
            msg.write('i32>', 0);
            return msg.build({ });
        }

        log.data(`[OUT] << 'MSG_PULSE' (0x26)`);
        server.send(pulseMessage());
    }
}