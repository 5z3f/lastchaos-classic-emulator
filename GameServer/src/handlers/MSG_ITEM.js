const log = require('@local/shared/logger');
const game = global.game;
const { InventoryRow } = require('../system/inventory');

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
            MSG_ITEM_TAKE: () =>
            {
                var msgdata = {
                    'objType': msg.read('u8'),
                    'objUid': msg.read('i32>'),
                    'itemUid': msg.read('i32>')
                }
                
                // find character by session id
                var character = game.world.find('character', (ch) => ch.uid == session.uid);

                // TODO: only character pickup is supported for now
                if(msgdata.objType != 0)
                    return;

                // TODO: packet is probably malformed, log this in future
                if(msgdata.objUid != character.uid)
                    return;
                
                // find ground item
                var found = game.world.find('item', (i) => i.uid == msgdata.itemUid && i.charUid == character.uid);

                // remove item from groud items queue
                game.world.remove({ type: 'item', zoneId: 0 }, (i) => i.uid != found.uid);

                // create inventory row
                var invenRow = new InventoryRow({
                    itemUid: found.uid,
                    itemId: found.id,
                    count: found.count
                });
            
                // add row to inventory
                character.inventory.add(0, invenRow);

                // send item take message
                session.send.item('MSG_ITEM_TAKE', {
                    objType: 0,
                    objUid: character.uid,
                    itemUid: found.uid
                });
            },
            MSG_ITEM_THROW: () => { },
            MSG_ITEM_ARRANGE: () => { },
            MSG_ITEM_DELETE: () => { },
            MSG_ITEM_WEAR: () =>
            {
                var msgdata = {
                    'wearingPosition': msg.read('u8'),
                    'item': {
                        'position': {
                            'tab': msg.read('u8'),
                            'col': msg.read('u8'),
                            'row': msg.read('u8'),
                        },
                        'uid': msg.read('i32>'),
                    }
                }

                // find character by session id
                var character = game.world.find('character', (ch) => ch.uid == session.uid);

                // if character tries to take an item off
                if(msgdata.item.uid == -1) {
                    // unequip already equipped item by its wearing position and return following data: position, row data
                    var result = character.inventory.unequip(msgdata.wearingPosition);

                    if(!result) {
                        session.send.sys(2); // MSG_SYS_CANNOT_WEAR
                        return;
                    }

                    session.send.item('MSG_ITEM_WEAR', {
                        wearingPosition: msgdata.wearingPosition,
                        srcRow: {
                            position: { tab: 0, col: 0, row: 0 },
                            itemUid: -1
                        },
                        dstRow: {
                            position: result.position,
                            itemUid: result.data.itemUid
                        }
                    });

                    return;
                }

                // find inventory row by unique id and if its not equipped already
                var requestedRow = character.inventory.find(msgdata.item.position.tab, (i) => i?.wearingPosition == 255 && i?.itemUid == msgdata.item.uid);

                if(!requestedRow) {
                    session.send.sys(2); // MSG_SYS_CANNOT_WEAR
                    return;
                }
                
                var dbItem = game.database.find('item', (i) => i.id == requestedRow.data.itemId);

                // TODO: check if dbItem class is equal with characters class

                // TODO: packet is probably malformed, log this in future
                if(msgdata.wearingPosition != dbItem.wearingPosition) {
                    return false;
                }
                
                // unequip already equipped item by its wearing position and return following data: position, row data
                // this will return null if character is trying to equip gear while being nude
                var unequippedRow = character.inventory.unequip(msgdata.wearingPosition);

                session.send.item('MSG_ITEM_WEAR', {
                    wearingPosition: msgdata.wearingPosition,
                    srcRow: {
                        position: {
                            tab: 0,
                            col: msgdata.item.position.col,
                            row: msgdata.item.position.row
                        },
                        itemUid: msgdata.item.uid
                    },
                    dstRow: {
                        position: {
                            tab: unequippedRow?.position.tab ?? 0,
                            col: unequippedRow?.position.col ?? 0,
                            row: unequippedRow?.position.row ?? 0
                        },
                        itemUid: unequippedRow?.data.itemUid ?? -1
                    }
                });

                // character is wearing this item now so lets update its status
                character.inventory.update(requestedRow.position, { wearingPosition: msgdata.wearingPosition });
            },
            MSG_ITEM_SWAP: () =>
            {
                var msgdata = {
                    'tabId': msg.read('u8'),
                    'item': {
                        'src': {
                            'position': {
                                'col': msg.read('u8'),
                                'row': msg.read('u8')
                            },
                            'uid': msg.read('i32>'),
                        },
                        'dst': {
                            'position': {
                                'col': msg.read('u8'),
                                'row': msg.read('u8'),
                            },
                            'uid': msg.read('i32>'),
                        },
                    }
                }

                // find character by session id
                var character = game.world.find('character', (ch) => ch.uid == session.uid);

                // swap item
                character.inventory.swap(msgdata.tabId, msgdata.item.src, msgdata.item.dst);
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