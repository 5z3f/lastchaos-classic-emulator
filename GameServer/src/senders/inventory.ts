import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return (inventory) => {
        const itemMsg = (
            msg: Message,
            itemUid = 0,
            itemId = 0,
            wearingPosition = 0,
            plus = 0,
            flag = 0,
            durability = 0,
            stack = 0,
            options: { type: number, level: number }[] = []
        ) => {
            if (!itemId) {
                msg.write('i32>', -1);      // unique index
                return;
            }

            msg.write('i32>', itemUid);                                 // unique index
            msg.write('i32>', itemId);                                  // item index
            msg.write('u8', wearingPosition);                           // wear position
            msg.write('i32>', plus);                                    // plus
            msg.write('i32>', flag);                                    // flag
            msg.write('i32>', durability);                              // durability
            msg.write('i64>', stack);                                   // count

            msg.write('u8', options.length);                            // option count

            for (let i = 0; i < options.length; i++) {
                msg.write('u8', options[i].type);                       // option type
                msg.write('u8', options[i].level);                      // option level
            }
        };

        let items = inventory.get();

        // tabs
        for (let i = 0; i < items.length; i++) {
            // columns
            for (let j = 0; j < items[i].length; j++) {
                let msg = new Message({ type: _messages.MSG_INVENTORY });

                msg.write('u8', 0);       // resultArrange
                msg.write('u8', i);       // tabId
                msg.write('u8', j);       // colId

                for (let k = 0; k < items[i][j].length; k++) {
                    let row = items[i][j][k];

                    if (!row) {
                        itemMsg(msg, undefined);
                        continue;
                    }

                    itemMsg(msg, row.itemUid, row.item.id, row.wearingPosition, row.plus, row.flag, row.durability, row.stack, row.options);
                }

                session.write(msg.build());
            }
        }
    }
}
