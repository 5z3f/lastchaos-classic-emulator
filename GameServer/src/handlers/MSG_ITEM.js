const message = require('@local/shared/message');
const log = require('@local/shared/logger');
const game = require('../game');

module.exports = {
    name: 'MSG_ITEM',
    handle: function (session, msg)
    {
        var subType = msg.read('u8');
        console.log('item msg sub type', subType);

        var subTypeMap = {
            0: 'MSG_ITEM_USE',
            1: 'MSG_ITEM_TAKE',
            2: 'MSG_ITEM_THROW',
            3: 'MSG_ITEM_ARRANGE',
            4: 'MSG_ITEM_DELETE',
            5: 'MSG_ITEM_WEAR',
            6: 'MSG_ITEM_SWAP',
            12: 'MSG_ITEM_BUY',
            13: 'MSG_ITEM_SELL',
            14: 'MSG_ITEM_UPGRADE_REQ',
            16: 'MSG_ITEM_REFINE_REQ',
            18: 'MSG_ITEM_OPTION_ADD_REQ',
            18: 'MSG_ITEM_OPTION_DEL_REQ',
            22: 'MSG_ITEM_PROCESS_REQ',
            24: 'MSG_ITEM_MAKE_REQ',
            26: 'MSG_ITEM_MIX_REQ',
            // TODO: add more types

        };

        const subTypeHandler =
        {
            MSG_ITEM_USE: () => { },
            MSG_ITEM_TAKE: () => { },
            MSG_ITEM_THROW: () => { },
            MSG_ITEM_ARRANGE: () => { },
            MSG_ITEM_DELETE: () => { },
            MSG_ITEM_WEAR: () =>
            {
                var data = {
                    'position': msg.read('u8'),
                    'item': {
                        'tab': msg.read('u8'),
                        'col': msg.read('u8'),
                        'row': msg.read('u8'),
                        'uid': msg.read('i32>'),
                    }
                }

                // find character by session id
                var character = game.find('character', (ch) => ch.uid == session.uid);

                // if character tries to take an item off
                if(data.item.uid == -1)
                {
                    // unequip already equipped item by its wearing position and return following data: col, row, inventory item
                    var result = character.inventory.unequip(data.position);

                    if(result == null) {
                        session.send.sys(2); // MSG_SYS_CANNOT_WEAR
                        return;
                    }

                    session.send.item('MSG_ITEM_WEAR', {
                        position: data.position,
                        tabSrc: 0,
                        colSrc: 0,
                        rowSrc: 0,
                        uidSrc: -1,
                        tabDst: 0,
                        colDst: result.col,
                        rowDst: result.row,
                        uidDst: result.item.uid
                    });

                    return;
                }

                // find inventory row by unique id and if its not equipped already
                var requestedRow = character.inventory.find(data.item.tab, (i) => i?.wearing == false && i?.uid == data.item.uid);

                if(requestedRow == null) {
                    session.send.sys(2); // MSG_SYS_CANNOT_WEAR
                    return;
                }
                
                // unequip already equipped item by its wearing position and return following data: col, row, inventory item
                var unequippedRow = character.inventory.unequip(data.position);

                // find already equipped row by wearing position
                // var found2 = character.inventory.find(data.item.tab, (i) => i?.wearing == true && i?.item.wearingPosition == data.position);                

                session.send.item('MSG_ITEM_WEAR', {
                    position: data.position,
                    tabSrc: 0,
                    colSrc: data.item.col,
                    rowSrc: data.item.row,
                    uidSrc: data.item.uid,
                    tabDst: 0,
                    colDst: unequippedRow?.col ?? 0,
                    rowDst: unequippedRow?.row ?? 0,
                    uidDst: unequippedRow?.item.uid ?? -1
                });

                // character is wearing this item now so lets update its status
                character.inventory.update(0, requestedRow.col, requestedRow.row, { wearing: true });
            },
            MSG_ITEM_SWAP: () =>
            {
                var data = {
                    'tabId': msg.read('u8'),
                    'items': {
                        'src': {
                            'col': msg.read('u8'),
                            'row': msg.read('u8'),
                            'uid': msg.read('i32>'),
                        },
                        'dst': {
                            'col': msg.read('u8'),
                            'row': msg.read('u8'),
                            'uid': msg.read('i32>'),
                        },
                    }
                }

                // find character by session id
                var character = game.find('character', (ch) => ch.uid == session.uid);

                // swap item
                var swapped = character.inventory.swap(data.tabId, data.items.src, data.items.dst);

                // if(!swapped)
                //   raise error message (if exists)
                //   return;

                // send swap message
                session.send.item('MSG_ITEM_SWAP', data);
            },
            MSG_ITEM_BUY: () => { },
            MSG_ITEM_SELL: () => { },
            MSG_ITEM_UPGRADE_REQ: () => { },
            MSG_ITEM_REFINE_REQ: () => { },
            MSG_ITEM_OPTION_ADD_REQ: () => { },
            MSG_ITEM_OPTION_DEL_REQ: () => { },
            MSG_ITEM_PROCESS_REQ: () => { },
            MSG_ITEM_MAKE_REQ: () => { },
            MSG_ITEM_MIX_REQ: () => { },
        };

        if(subTypeMap[subType] in subTypeHandler) {
            log.info(`MSG_ITEM >> ${ subTypeMap[subType] }`);
            subTypeHandler[subTypeMap[subType]]();
        }
    }
}