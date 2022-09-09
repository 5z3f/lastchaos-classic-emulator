const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_INVENTORY',
    send: function (session, msgId)
    {
        return (inventory) =>
        {
            const itemMsg = (msg, itemUid, itemId, wearingPosition, plus, flag, durability, count, options) =>
            {
                if(itemId == undefined) {
                    msg.write('i32>', -1);      // unique index
                    return;
                }

                msg.write('i32>', itemUid);                                 // unique index
                msg.write('i32>', itemId);                                  // item index
                msg.write('u8', wearingPosition);                           // wear position
                msg.write('i32>', plus);                                    // plus
                msg.write('i32>', flag);                                    // flag
                msg.write('i32>', durability);                              // durability
                msg.write('i64>', count);                                   // count

                msg.write('u8', options.length);                            // option count

                for(var i = 0; i < options.length; i++) {
                    msg.write('u8', options[i].type);                       // option type
                    msg.write('u8', options[i].level);                      // option level
                }
            };

            const inven = (inv) =>
            {
                var items = inv.get();

                // tabs
                for(var i = 0; i < items.length; i++)
                {
                    // columns
                    for(var j = 0; j < items[i].length; j++)
                    {
                        var msg = new Message({ type: msgId });

                        msg.write('u8', 0);       // resultArrange
                        msg.write('u8', i);       // tabId
                        msg.write('u8', j);       // colId

                        for(var k = 0; k < items[i][j].length; k++)
                        {
                            let row = items[i][j][k];

                            if(row == undefined) {
                                itemMsg(msg, undefined);
                                continue;
                            }

                            itemMsg(msg, row.itemUid, row.itemId, row.wearingPosition, row.plus, row.flag, row.durability, row.count, row.options);
                        }

                        session.write(msg.build());
                    }
                }
            }

            inven(inventory);
        }
    }
}