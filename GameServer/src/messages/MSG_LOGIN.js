const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        const characterExistMessage = () =>
        {
            // MSG_DB -> MSG_DB_CHAR_EXIST
            var msg = new message({ type: 0x02, subType: 0x02 });

            msg.write('i32>', 1);             // Character ID
            msg.write('stringnt', 'test');    // Name
            msg.write('u8', 1);               // Job
            msg.write('u8', 1);               // Job2
            msg.write('u8', 1);               // Hair
            msg.write('u8', 1);               // Face
            msg.write('i32>', 15);            // Level
            msg.write('u64>', 10);            // Current Experience
            msg.write('u64>', 1000);          // Max Experience
            msg.write('i32>', 10);            // Skill Points
            msg.write('i32>', 1000);          // Current Health Points
            msg.write('i32>', 1000);          // Max Health Points
            msg.write('i32>', 1000);          // Current Mana Points
            msg.write('i32>', 1000);          // Max Mana Points

            var wear = [ 75, 34, 48, 38, 49, 39, 41 ];
            var plus = [ 15, 15, 15, 15, 15, 15, 15 ];

            // WEAR_COUNT = 7
            for(var i = 1; i < 7 ; ++i)
            {
                msg.write('i32>', wear[i]);
                msg.write('i32>', plus[i]);
            }

            msg.write('i32>', -1);          // Remain Character Delete Time

            return msg.build({ });
        }

        const characterExistEndMessage = () => {
            // MSG_DB -> MSG_DB_CHAR_END
            var msg = new message({ type: 0x02, subType: 0x03 });
            return msg.build({ });
        }

        log.data(`[OUT] << 'MSG_DB -> MSG_DB_CHAR_EXIST' (0x02 -> 0x02)`);
        server.send(characterExistMessage());

        log.data(`[OUT] << 'MSG_DB -> MSG_DB_CHAR_END' (0x02 -> 0x03)`);
        server.send(characterExistEndMessage());
    }
};