const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_MENU',
    handle: function (session, msg)
    {
        var subType = msg.read('u8');
        var subTypeMap = {
            2: 'MSG_MENU_START',
        };

        const subTypeHandler =
        {
            MSG_MENU_START: () =>
            {
                var characterId = msg.read('i32>'); // selected character id

                // send start game message
                session.send.db('MSG_DB_OK');
            }
        };

        if(subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();
    }
}