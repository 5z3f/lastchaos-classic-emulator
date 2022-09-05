const message = require('@local/shared/message');
const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_GM',
    handle: function (session, msg)
    {
        var subType = msg.read('u8');

        var subTypeMap = {
            0: 'MSG_GM_WHOAMI',
            1: 'MSG_GM_COMMAND'
        }

        const subTypeHandler =
        {
            MSG_GM_WHOAMI: () => {
                session.send.gm('MSG_GM_WHOAMI');

                var character = object.get({ uid: session.uid });
                
                session.send.chat({
                    chatType: 7,
                    senderId: character.uid,
                    senderName: character.character.name,
                    receiverName: character.character.name,
                    text: `You're level 10 admin`
                });
            }
        }

        if(subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();
    }
}