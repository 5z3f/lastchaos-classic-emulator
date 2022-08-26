const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        const atMessage = () => {
            // MSG_AT
            var msg = new message({ type: 0x09 });
            
            msg.write('i32>', 40);          // m_index
            msg.write('stringnt', 'test');  // name
            msg.write('u8', 1);             // m_job
            msg.write('u8', 1);             // hairstyle
            msg.write('u8', 1);             // facestyle
            msg.write('i32>', 0);           // zoneId
            msg.write('i32>', 0);           // areaId
            msg.write('f<', 1175.5);        // X
            msg.write('f<', 1028.5);        // Z
            msg.write('f<', 160.3);         // H
            msg.write('f<', 0);             // R
            msg.write('u8', 0);             // Y LAYER
            msg.write('i32>', 1);           // m_desc->m_index
            msg.write('i32>', 0);           // m_guildoutdate

            return msg.build({ clientId: receivedMsg.clientId });
        }

        const statusMessage = () => {            
            // MSG_STATUS
            var msg = new message({ type: 0x06 });

            msg.write('i16>', 35);          // Level
            msg.write('u64>', 0);           // Current Experience
            msg.write('u64>', 23223182);    // Max Experience
            msg.write('i16>', 1921);        // Current Health Points
            msg.write('i16>', 1921);        // Max Health Points
            msg.write('i16>', 2011);        // Current Mana Points
            msg.write('i16>', 2011);        // Max Mana Points

            msg.write('i16>', 116);         // Strength
            msg.write('i16>', 141);         // Dexterity
            msg.write('i16>', 105);         // Intelligence
            msg.write('i16>', 105);         // Condition

            msg.write('i16>', 8);           // Added Strength
            msg.write('i16>', 0);           // Added Dexterity
            msg.write('i16>', 0);           // Added Intelligence
            msg.write('i16>', 0);           // Added Condition

            msg.write('i16>', 1147);        // Attack
            msg.write('i16>', 105);         // Magic Attack

            msg.write('i16>', 31881);       // Defense
            msg.write('i16>', 1);           // Magic Resist

            msg.write('i32>', 281716704);   // Skillpoint
            msg.write('i32>', 3607);        // Weight
            msg.write('i32>', 9400);        // Max Weight

            msg.write('f<', 6.8);           // Walk Speed
            msg.write('f<', 8.0);           // Run Speed

            msg.write('u8', 12);            // Attack Speed
            msg.write('u8', 0);             // Magic Speed (?)

            msg.write('u8', 0);             // PK Name
            msg.write('i32>', 0);           // PK Penalty
            msg.write('i32>', 0);           // PK Count
            
            return msg.build({ clientId: receivedMsg.clientId });
        }

        const gameTimeMessage = (date) => {
            // MSG_ENV -> MSG_ENV_TIME
            var msg = new message({ type: 0x16, subType: 0x02 });

            msg.write('i32>', date.getFullYear());
            msg.write('u8', date.getMonth() + 1);
            msg.write('u8', date.getDate());
            msg.write('u8', date.getHours());
            msg.write('u8', date.getMinutes());
            msg.write('u8', date.getSeconds());

            return msg.build({ clientId: receivedMsg.clientId });
        }

        /* 
        const appearMessage = () => {            
            // MSG_APPEAR
            var msg = new message({ type: 0x07 });
                   
            msg.write('u8', 1);             // new
            msg.write('u8', 0);             // m_type
            msg.write('i32>', 1);           // m_index
            msg.write('stringnt', 'test');  // m_index
            msg.write('u8', 1);             // m_job
            msg.write('u8', 1);             // hairstyle
            msg.write('u8', 1);             // facestyle

            msg.write('f>', 1255);          // X
            msg.write('f>', 341);           // Z
            msg.write('f>', 160);           // H
            msg.write('f>', 0);             // R
            msg.write('u8', 0);             // Y LAYER

            msg.write('i16>', 100);         // hp
            msg.write('i16>', 1000);        // maxhp

            msg.write('u8', 0);             // player state
            msg.write('i32>', 0);           // pkpenalty
            msg.write('u8', 0);             // getpkname

            var armor = [ 75, 34, 48, 38, 49, 39, 41 ];
            var plus =  [ 15, 15, 15, 15, 15, 15, 15 ];

            for(var i = 1; i <= 6; ++i)
            {
                msg.write('i32>', armor[i - 1]);
                msg.write('i32>', plus[i - 1]);
            }

            msg.write('i32>', 0);           // assist state
            msg.write('u8', 1);             // assist count

           for(var i = 0; i < 1; i++)
           {
               packet.writeInt32BE(-1);
               packet.writeInt32BE(-1);
               packet.writeUInt8(0x00);
               packet.writeInt32BE(-1);
           }

           for(var i = 0; i < 1; i++)
           {
               packet.writeInt32BE(-1);
               packet.writeInt32BE(-1);
               packet.writeUInt8(0x00);
               packet.writeInt32BE(-1);
           }

            packet.writeUInt8(0x00);                 // personal shop mode
            packet.writeStringNT('');                // title

            packet.writeInt32BE(-1);                 // guild id
            packet.writeStringNT('');                // guild name
            packet.writeInt32BE(-1);                 // 

            packet.writeInt32BE(-1);                 // 

            return packet;
        }

        const inventoryMessage = () => {
            var packet = new SmartBuffer();

            packet.writeUInt8(0x0A);                    // MSG_INVENTORY

            packet.writeUInt8(0x00);                    // resultArrange

            packet.writeUInt8(0x00);                    // tabType
            packet.writeUInt8(0x00);                    // rowId

            for(var i = 0; i < 4; i++)                  // ITEMS_PER_ROW
            {   
                packet.writeInt32BE(19);                // item_idx
                packet.writeInt32BE(1);                 // item_type
                packet.writeUInt8(0);                  // wear_pos
                packet.writeInt32BE(-1);                // plus
                packet.writeInt32BE(-1);                // flag
                packet.writeInt32BE(-1);                // used
                packet.writeBigUInt64BE(BigInt(10));    // count

                var optionCount = 0;

                packet.writeUInt8(optionCount);                  // option count

                for(var j = 0; j < optionCount; j++) {
                    packet.writeUInt8(0);                  // type
                    packet.writeUInt8(0);                  // level
                }
            }

            return packet;
        }
        */

        log.data(`[OUT] << 'MSG_AT' (0x09)`);
        server.send(atMessage());
    
        log.data(`[OUT] << 'MSG_STATUS' (0x06)`);
        server.send(statusMessage());
    
        log.data(`[OUT] << 'MSG_ENV -> MSG_ENV_TIME' (0x16 -> 0x02)`);
        server.send(gameTimeMessage(new Date()));

        //log.data(`[OUT] << 'MSG_INVENTORY' (0x0A)`);
        //server.send(inventoryMessage());
   
        //msgBuf = message.build(Buffer.from('0x70x00x10x00x00x60xf30x00x00x10xe60x140x160x850x440x80x3c0x680x440x480x610x200x430x00x00x70xc30x00x00x00x00x00x00x00x00x10x00x00x00x00x00xa', 'hex'), msg.header.clientId, true);
        //server.send(msgBuf);
        //log.data(`[OUT] << 'MSG_APPEAR' (0x07)`);
    }
}