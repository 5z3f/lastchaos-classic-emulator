const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_INVENTORY',
    send: function (session, msgId)
    {
        return () =>
        {
            const item = (msg, uid, id, wearpos, plus, flag, durability, count) =>
            {
                if(id == -1) {
                    msg.write('i32>', -1);      // unique index
                    return;
                }

                msg.write('i32>', uid);         // unique index
                msg.write('i32>', id);          // db index
                msg.write('u8', wearpos);       // wear position
                msg.write('i32>', plus);        // plus
                msg.write('i32>', flag);        // flag
                msg.write('i32>', durability);  // durability
                msg.write('i64>', count);       // count

                msg.write('u8', 0);             // option count

                //for(var j = 0; j < optionCount; j++)
                //{
                //    msg.write('u8', 0);             // optionType
                //    msg.write('u8', 0);             // optionLevel
                //}
            };

            const row = () =>
            {
                var wear =      [ 75, 34, 1901, 38, -1, 39, 41 ];
                var plus =      [ 15, 15, 15,   15, 15, 15, 15 ];
                var wearpos =   [ 0,  1,  2,    3,  4,  5,  6  ];

                var msg = new message({ type: msgId });

                msg.write('u8', 1);       // resultArrange
                msg.write('u8', 0);       // tabId
                msg.write('u8', 0);       // rowId

                // ITEMS_PER_ROW = 5
                for(var i = 0; i < 5; i++)
                    item(msg, i + 1, wear[i], wearpos[i], 15, 62, -1, 0);


                session.write(msg.build({ }));
            }

            row();
        }
    }
}