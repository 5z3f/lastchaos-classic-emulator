const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('../log');
const server = require('../server');
const message = require('../message');

module.exports = {
    onReceive: (msg, toGameServer) =>
    {
        if(toGameServer)
        {
            const characterExistMessage = () =>
            {
                const packet = new SmartBuffer();

                packet.writeUInt8(0x02);                // MSG_DB
                packet.writeUInt8(0x02);                // MSG_DB_CHAR_EXIST

                packet.writeInt32BE(1);                 // Character ID
                packet.writeStringNT('test');           // Name
                packet.writeUInt8(1);                   // Job
                packet.writeUInt8(1);                   // Hair
                packet.writeUInt8(1);                   // Face
                packet.writeInt16BE(1);                 // Level
                packet.writeBigUInt64BE(BigInt(1000));  // Max Experience
                packet.writeBigUInt64BE(BigInt(1));     // Current Experience
                packet.writeInt32BE(1);                 // Skill Points
                packet.writeInt16BE(1000);              // Current Health Points
                packet.writeInt16BE(1000);              // Max Health Points
                packet.writeInt16BE(1000);              // Current Mana Points
                packet.writeInt16BE(1000);              // Max Mana Points

                packet.writeInt32BE(90);                // Helmet ID
                packet.writeInt32BE(95);                // Shirt ID
                packet.writeInt32BE(98);                // Pants ID
                packet.writeInt32BE(-1);                 // Shield ID
                packet.writeInt32BE(100);               // Gloves ID
                packet.writeInt32BE(103);               // Boots ID

                return packet;
            }

            const characterExistEndMessage = () => {
                const packet = new SmartBuffer();

                packet.writeUInt8(0x02); // MSG_DB
                packet.writeUInt8(0x03); // MSG_DB_CHAR_END

                return packet;
            }

            //for(var i = 1; i < 5; i++)
            //{
                var buf = message.build(characterExistMessage(), msg.header.clientId);
                server.send(buf);
            //}

            log.data(`[OUT] >> 'MSG_DB -> MSG_DB_CHAR_EXIST' (0x02 -> 0x02)`);

            var buf1 = message.build(characterExistEndMessage(), msg.header.clientId);
            server.send(buf1);

            log.data(`[OUT] >> 'MSG_DB -> MSG_DB_CHAR_END' (0x02 -> 0x03)`);
        }
        else
        {
            log.data(`MESSAGE HEADER >> ${ JSON.stringify(msg.header) }`);

            const serverInfoMessage = () => {
                const packet = new SmartBuffer();
    
                packet.writeUInt8(0x22);                // 0x22
                packet.writeInt32BE(1);                 // recentServer
                packet.writeInt32BE(1);                 // recentSubNum
                packet.writeInt32BE(1);                 // connectorCount
                packet.writeInt32BE(1);                 // connectorId
                packet.writeInt32BE(1);                 // serverNo
                packet.writeInt32BE(1);                 // maxServer
                packet.writeInt32BE(1);                 // serverSubNo
                packet.writeInt32BE(0x08AD);            // playerCount
                packet.writeStringNT('127.0.0.1');      // ipAddress
                packet.writeInt32BE(4191);              // port
            
                // 22  00 00 00 01  00 00 00 01  00 00 00 01  00 00 00 01  00 00 00 01  00 00 00 01  00 00 00 01  00 00 08 ad  31 32 37 2e 30 2e 30 2e 31 00  00 00 10 5f
                return packet;
            };

            var buf = message.build(serverInfoMessage(), msg.header.clientId);
            server.send(buf);

            log.data(`[OUT]  >> 'MSG_LOGINSERV_PLAYER' (0x22)`);
        }
    }
};