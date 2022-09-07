const message = require('@local/shared/message');
const { WebGLArrayRenderTarget } = require('three');
const { add } = require('../game');

module.exports = {
    messageName: 'MSG_ITEM',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            const wear = ({ position, tabSrc, colSrc, rowSrc, uidSrc, tabDst, colDst, rowDst, uidDst }) =>
            {
                var msg = new message({ type: msgId, subType: 5 });
            
                msg.write('u8', position);

                msg.write('u8', tabSrc);
                msg.write('u8', colSrc);
                msg.write('u8', rowSrc);
                msg.write('i32>', uidSrc);

                msg.write('u8', tabDst);
                msg.write('u8', colDst);
                msg.write('u8', rowDst);
                msg.write('i32>', uidDst);

                session.write(msg.build());
            }

            const swap = (data) =>
            {
                var msg = new message({ type: msgId, subType: 6 });
            
                msg.write('u8', data.tabId);

                msg.write('u8', data.items.src.col);
                msg.write('u8', data.items.src.row);
        
                msg.write('u8', data.items.dst.col);
                msg.write('u8', data.items.dst.row);

                session.write(msg.build());  
            };

            const drop = ({ uid, id, count, position, objType, objUid }) =>
            {
                var msg = new message({ type: msgId, subType: 9 });
            
                msg.write('i32>', uid);         // item uid
                msg.write('i32>', id);          // item id
                msg.write('i64>', count);       // item count
                msg.write('f<', position.x);
                msg.write('f<', position.z);
                msg.write('f<', position.h);
                msg.write('f<', position.r);
                msg.write('u8', position.y);

                msg.write('u8', objType);       // object type
                msg.write('i32>', objUid);      // object uid

                //msg.write('u8', 1);           // not sure wat is dis

                session.write(msg.build());
            }

            const add = (data) =>
            {
                var msg = new message({ type: msgId, subType: 7 });
            
                msg.write('u8', data.tab);
                msg.write('u8', data.col);
                msg.write('u8', data.row);
                msg.write('i32>', data.inventoryItem.uid);
                msg.write('i32>', data.inventoryItem.item.id);
                msg.write('u8', data.inventoryItem.wearing ? data.inventoryItem.item.wearingPosition : 255);
                msg.write('i32>', data.inventoryItem.plus);
                msg.write('i32>', data.inventoryItem.flag);
                msg.write('i32>', data.inventoryItem.item.durability);
                msg.write('i64>', data.inventoryItem.count);
                msg.write('u8', 0);

                session.write(msg.build());
            }

            const subTypeHandler = {
                'MSG_ITEM_WEAR': () => wear(data),
                'MSG_ITEM_SWAP': () => swap(data),
                'MSG_ITEM_DROP': () => drop(data),
                'MSG_ITEM_ADD': () => add(data)
            };

            if(subType in subTypeHandler)
                subTypeHandler[subType]();         
        }
    }
}