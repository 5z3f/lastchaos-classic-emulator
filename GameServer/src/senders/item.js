const Message = require('@local/shared/message');
const { WebGLArrayRenderTarget } = require('three');
const { add } = require('../game');

module.exports = {
    messageName: 'MSG_ITEM',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            const wear = ({ wearingPosition, srcRow, dstRow }) =>
            {
                var msg = new Message({ type: msgId, subType: 5 });
            
                msg.write('u8', wearingPosition);

                msg.write('u8', srcRow.position.tab);
                msg.write('u8', srcRow.position.col);
                msg.write('u8', srcRow.position.row);
                msg.write('i32>', srcRow.itemUid);

                msg.write('u8', dstRow.position.tab);
                msg.write('u8', dstRow.position.col);
                msg.write('u8', dstRow.position.row);
                msg.write('i32>', dstRow.itemUid);

                session.write(msg.build());
            }

            const swap = ({ tab, src, dst }) =>
            {
                var msg = new Message({ type: msgId, subType: 6 });
            
                msg.write('u8', tab);

                msg.write('u8', src.position.col);
                msg.write('u8', src.position.row);
        
                msg.write('u8', dst.position.col);
                msg.write('u8', dst.position.row);

                session.write(msg.build());  
            };

            const drop = ({ uid, id, count, position, objType, objUid }) =>
            {
                var msg = new Message({ type: msgId, subType: 9 });
            
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

            const add = ({ itemUid, itemId, position, wearingPosition, plus, flag, durability, count/* TODO: , options */}) =>
            {
                var msg = new Message({ type: msgId, subType: 7 });
            
                msg.write('u8', position.tab);
                msg.write('u8', position.col);
                msg.write('u8', position.row);
                msg.write('i32>', itemUid);
                msg.write('i32>', itemId);
                msg.write('u8', wearingPosition);
                msg.write('i32>', plus);
                msg.write('i32>', flag);
                msg.write('i32>', durability);
                msg.write('i64>', count);
                msg.write('u8', 0);

                session.write(msg.build());
            }

            const take = ({ objType, objIndex, itemUid }) => {
                var msg = new Message({ type: msgId, subType: 1 });
            
                msg.write('u8', objType);
                msg.write('i32>', objIndex);
                msg.write('i32>', itemUid);

                session.write(msg.build());
            }

            const subTypeHandler = {
                'MSG_ITEM_WEAR': () => wear(data),
                'MSG_ITEM_SWAP': () => swap(data),
                'MSG_ITEM_DROP': () => drop(data),
                'MSG_ITEM_ADD': () => add(data),
                'MSG_ITEM_TAKE': () => take(data)
            };

            if(subType in subTypeHandler)
                subTypeHandler[subType]();         
        }
    }
}