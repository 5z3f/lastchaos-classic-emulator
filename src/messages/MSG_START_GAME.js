const SmartBuffer = require('smart-buffer').SmartBuffer;

const log = require('../log');
const server = require('../server');
const message = require('../message');

module.exports = {
    onReceive: (msg) =>
    {
        var reader = msg.reader;

        const atMessage = () => {
            var packet = new SmartBuffer();

            packet.writeUInt8(0x09);        // MSG_AT
            packet.writeInt32BE(1);         // m_index
            packet.writeStringNT('test');   // name
            packet.writeUInt8(1);           // m_job
            packet.writeUInt8(1);           // hairstyle
            packet.writeUInt8(1);           // facestyle
            packet.writeInt32BE(0);         // m_pZone->m_index
            packet.writeInt32BE(0);         // m_pArea->m_index
            packet.writeFloatBE(535);       // X
            packet.writeFloatBE(845);       // Z
            packet.writeFloatBE(160);       // H
            packet.writeFloatBE(0);         // R
            packet.writeUInt8(0);           // Y LAYER
            packet.writeInt32BE(0);         // m_desc->m_index
            packet.writeInt32BE(0);         // m_guildoutdate

            return packet;
        }

        const statusMessage = () => {
            var packet = new SmartBuffer();
            
            packet.writeUInt8(0x06);                // MSG_STATUS
            
            packet.writeInt16BE(15);                // level
            packet.writeBigUInt64BE(BigInt(1));     // Current Experience
            packet.writeBigUInt64BE(BigInt(1000));  // Max Experience
            packet.writeInt16BE(1000);              // Current Health Points
            packet.writeInt16BE(1000);              // Max Health Points
            packet.writeInt16BE(1000);              // Current Mana Points
            packet.writeInt16BE(1000);              // Max Mana Points
            packet.writeInt16BE(10);               // str
            packet.writeInt16BE(10);               // dex
            packet.writeInt16BE(10);               // intl
            packet.writeInt16BE(10);               // con
            packet.writeInt16BE(10);               // op_str
            packet.writeInt16BE(10);               // op_dex
            packet.writeInt16BE(10);               // op_intl
            packet.writeInt16BE(10);               // op_con
            packet.writeInt16BE(10);               // attack
            packet.writeInt16BE(10);               // magic
            packet.writeInt16BE(10);               // defense
            packet.writeInt16BE(10);               // resist
            packet.writeInt32BE(10);               // sp
            packet.writeInt32BE(10);               // weight
            packet.writeInt32BE(150);              // max weight
            packet.writeFloatBE(10.0);             // walk speed
            packet.writeFloatBE(10.0);             // run speed
            packet.writeUInt8(3);                  // attack speed
            packet.writeUInt8(3);                  // magic speed
            packet.writeUInt8(1);                  // pkname
            packet.writeInt32BE(1);                // pkpenalty
            packet.writeInt32BE(1);                // pkcount
            
            return packet;
        }

        const gameTimeMessage = () => {
            var packet = new SmartBuffer();

            var dateTime = new Date();

            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            var second = dateTime.getSeconds();

            packet.writeUInt8(0x22);        // MSG_ENV
            packet.writeUInt8(0x02);        // MSG_ENV_TIME

            packet.writeInt32BE(year);
            packet.writeUInt8(month);
            packet.writeUInt8(day);
            packet.writeUInt8(hour);
            packet.writeUInt8(minute);
            packet.writeUInt8(second);

            return packet;
        }

        const appearMessage = () => {
            var packet = new SmartBuffer();
            
            packet.writeUInt8(0x07);                // MSG_APPEAR
            packet.writeUInt8(1);                   // new
            packet.writeUInt8(1);                   // m_type
            packet.writeInt32BE(1);                 // m_index
            packet.writeStringNT('test');           // name
            packet.writeUInt8(1);                   // m_job
            packet.writeUInt8(1);                   // hairstyle
            packet.writeUInt8(1);                   // facestyle
            packet.writeFloatBE(535);               // X
            packet.writeFloatBE(845);               // Z
            packet.writeFloatBE(160);               // H
            packet.writeFloatBE(0);                 // R
            packet.writeUInt8(0);                   // Y LAYER
            packet.writeInt16BE(100);               // hp
            packet.writeInt16BE(1000);              // maxhp
            packet.writeUInt8(0);                   // player state
            packet.writeInt32BE(0);                 // pkpenalty
            packet.writeUInt8(0);                   // getpkname

            packet.writeInt32BE(90);                // Helmet ID
            packet.writeInt32BE(95);                // Shirt ID
            packet.writeInt32BE(98);                // Pants ID
            packet.writeInt32BE(-1);                // Shield ID
            packet.writeInt32BE(100);               // Gloves ID
            packet.writeInt32BE(103);               // Boots ID

            packet.writeInt32BE(-1);                // assist m_state
            packet.writeInt32BE(0);                 // assist count
            
            for(var i = 0; i < 5; i++)
            {
                packet.writeInt32BE(-1);
                packet.writeInt32BE(-1);
                packet.writeUInt8(0x00);
                packet.writeInt32BE(-1);
            }

            for(var i = 0; i < 5; i++)
            {
                packet.writeInt32BE(-1);
                packet.writeInt32BE(-1);
                packet.writeUInt8(0x00);
                packet.writeInt32BE(-1);
            }

            packet.writeUInt8(0x00);                 // buffs count

            packet.writeUInt8(0x00);                 // personal shop mode
            packet.writeStringNT('');                // title

            packet.writeInt32BE(-1);                 // guild id
            packet.writeStringNT('');                // guild name
            packet.writeInt32BE(-1);                 // 
            
            packet.writeInt32BE(-1);                 // 

            return packet;
        }

        var msgBuf = message.build(atMessage(), msg.header.clientId);
        server.send(msgBuf);
    
        log.data(`[OUT] >> 'MSG_AT' (0x09)`);

        msgBuf = message.build(gameTimeMessage(), msg.header.clientId);
        server.send(msgBuf);
    
        log.data(`[OUT] >> 'MSG_ENV -> MSG_ENV_TIME' (0x22 -> 0x02)`);

        msgBuf = message.build(statusMessage(), msg.header.clientId);
        server.send(msgBuf);
    
        log.data(`[OUT] >> 'MSG_STATUS' (0x06)`);

       // msgBuf = message.build(appearMessage(), msg.header.clientId);
       // server.send(msgBuf);
    
       // log.data(`[OUT] >> 'MSG_APPEAR' (0x07)`);

    }
}