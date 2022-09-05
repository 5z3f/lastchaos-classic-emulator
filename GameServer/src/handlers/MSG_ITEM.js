const message = require('@local/shared/message');
const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_ITEM',
    handle: function (session, msg)
    {
        var subType = msg.read('u8');
        console.log(subType)

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
            // TODO:

        };

        const subTypeHandler =
        {
            MSG_ITEM_USE: () => { },
            MSG_ITEM_TAKE: () => { },
            MSG_ITEM_THROW: () => { },
            MSG_ITEM_ARRANGE: () => { },
            MSG_ITEM_DELETE: () => { },
            MSG_ITEM_WEAR: () => { },
            MSG_ITEM_SWAP: () => {
                var data = {
                    'tabId': msg.read('u8'),
                    'items': {
                        'src': {
                            'col': msg.read('u8'),
                            'row': msg.read('u8'),
                            'itemUid': msg.read('u32>'),
                        },
                        'dst': {
                            'col': msg.read('u8'),
                            'row': msg.read('u8'),
                            'itemId': msg.read('i32>'),
                        },
                    }
                }
                console.log(data);

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