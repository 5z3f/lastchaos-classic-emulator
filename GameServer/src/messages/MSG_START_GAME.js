const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');
const object = require('../object');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        const gameTimeMessage = (date) => {
            // MSG_ENV -> MSG_ENV_TIME
            var msg = new message({ type: 0x16, subType: 0x02 });

            msg.write('i32>', date.getFullYear());
            msg.write('u8', date.getMonth() + 1);
            msg.write('u8', date.getDate());
            msg.write('u8', date.getHours());
            msg.write('u8', date.getMinutes());
            msg.write('u8', date.getSeconds());

            return msg.build({ });
        }

        const appearPlayerMessage = () => {            
            // MSG_APPEAR
            var msg = new message({ type: 0x07 });
                   
            msg.write('u8', 1);             // new
            msg.write('u8', 0);             // m_type
            msg.write('i32>', 1);           // m_index
            msg.write('stringnt', 'test');  // name
            msg.write('u8', 1);             // m_job
            msg.write('u8', 1);             // hairstyle
            msg.write('u8', 1);             // facestyle

            msg.write('f<', 1255);          // X
            msg.write('f<', 341);           // Z
            msg.write('f<', 160);           // H
            msg.write('f<', 0);             // R
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
                msg.write('i32>', -1);
                msg.write('i32>', -1);
                msg.write('u8', 0);
                msg.write('i32>', -1);
            }
            
            for(var i = 0; i < 1; i++)
            {
                msg.write('i32>', -1);
                msg.write('i32>', -1);
                msg.write('u8', 0);
                msg.write('i32>', -1);
            }

            msg.write('u8', 0);                     // personal shop mode
            msg.write('stringnt', '');              // title

            msg.write('i32>', -1);                     // guild id
            msg.write('stringnt', '');              // guild name

            msg.write('i32>', -1);                     // 
            msg.write('i32>', -1);                     // 

            return msg.build({ });
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

        // spawn character
        var obj = new object({
            type: 0,
            position: {
                'zoneId': 0,
                'areaId': 0,
                'x': 1111,
                'z': 951,
                'h': 160,
                'r': 0,
                'y': 0
            },
            character: {
                'name': 'test',
                'classType': 1,
                'jobType': 1,
                'hairType': 2,
                'faceType': 2,
            }
        });
        
        obj.appear();

        // game time packet
        log.data(`[OUT] << 'MSG_ENV -> MSG_ENV_TIME' (0x16 -> 0x02)`);
        server.send(gameTimeMessage(new Date()));

        // create test object
        var obj = new object({
            type: 1,
            id: 40,
            position: {
                'zoneId': 0,
                'areaId': 0,
                'x': 1111,
                'z': 951,
                'h': 160,
                'r': 0,
                'y': 0
            }
        });

        obj.appear();
        
        //log.data(`[OUT] << 'MSG_INVENTORY' (0x0A)`);
        //server.send(inventoryMessage());
   
        //msgBuf = message.build(Buffer.from('0x70x00x10x00x00x60xf30x00x00x10xe60x140x160x850x440x80x3c0x680x440x480x610x200x430x00x00x70xc30x00x00x00x00x00x00x00x00x10x00x00x00x00x00xa', 'hex'), msg.header.clientId, true);
        //server.send(msgBuf);
        //log.data(`[OUT] << 'MSG_APPEAR' (0x07)`);
    }
}