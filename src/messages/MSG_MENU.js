const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('../log');
const server = require('../server');
const message = require('../message');

module.exports = {
    onReceive: (msg) =>
    {
        var reader = msg.reader;
        var subType = reader.readUInt8();
        
        switch(subType)
        {
            case 0x02:
            {
                const startGameMessage = () => {
                    var packet = new SmartBuffer();
                    packet.writeUInt8(0x02); // MSG_DB
                    packet.writeUInt8(0x01); // MSG_DB_OK
                    return packet;
                }

                var buf = message.build(startGameMessage(), msg.header.clientId);
                server.send(buf);
    
                log.data(`[OUT] >> 'MSG_DB -> MSG_DB_OK' (0x02 -> 0x01)`);
            }
        }

    }
}