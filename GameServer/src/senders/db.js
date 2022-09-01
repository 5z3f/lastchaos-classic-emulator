const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_DB',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            const characterExists = (data) =>
            {
                // MSG_DB -> MSG_DB_CHAR_EXIST
                var msg = new message({ type: msgId, subType: 2 });
    
                msg.write('i32>', 1);               // Character ID (uid)
                msg.write('stringnt', 'test');      // Name
                msg.write('u8', 1);                 // Job
                msg.write('u8', 1);                 // Job2
                msg.write('u8', 1);                 // Hair
                msg.write('u8', 1);                 // Face
                msg.write('i32>', 15);              // Level
                msg.write('u64>', 10);              // Current Experience
                msg.write('u64>', 1000);            // Max Experience
                msg.write('i32>', 10);              // Skill Points
                msg.write('i32>', 1000);            // Current Health Points
                msg.write('i32>', 1000);            // Max Health Points
                msg.write('i32>', 1000);            // Current Mana Points
                msg.write('i32>', 1000);            // Max Mana Points
    
                var wear = [ 75, 34, 48, 38, 49, 39, 41 ];
                var plus = [ 15, 15, 15, 15, 15, 15, 15 ];
    
                // WEAR_COUNT = 7
                for(var i = 1; i < 7 ; ++i) {
                    msg.write('i32>', wear[i]);
                    msg.write('i32>', plus[i]);
                }
    
                msg.write('i32>', -1);              // Remain Character Delete Time
    
                session.write(msg.build({ }));
            }
    
            const characterExistEnd = () => {
                // MSG_DB -> MSG_DB_CHAR_END
                var msg = new message({ type: msgId, subType: 3 });
                session.write(msg.build({ }));
            }

            const startGame = () => {
                var msg = new message({ type: msgId, subType: 1 });
                session.write(msg.build({ }));
            }

            const subTypeHandler = {
                //'MSG_DB_SUCCESS': 0,
                'MSG_DB_OK': () => startGame(),
                'MSG_DB_CHAR_EXIST': (data) => characterExists(data),
                'MSG_DB_CHAR_END': () => characterExistEnd(),
                //'MSG_DB_OTHER_SERVER': 4
            };

            if(subType in subTypeHandler)
                subTypeHandler[subType]();
        }
    }
}