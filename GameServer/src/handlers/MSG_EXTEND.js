const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_EXTEND',
    handle: function (session, msg)
    {
        var subType = msg.read('u8');
        var subTypeMap = {
            28: 'MSG_EX_MESSENGER',
        };

        const subTypeHandler =
        {
            MSG_EX_MESSENGER: () => {

            }
        }

        if(subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();
    }
}