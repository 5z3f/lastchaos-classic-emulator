const message = require('@local/shared/message');
const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_QUEST',
    handle: function (session, msg)
    {
        var subTypeMap = {
            1: 'MSG_QUEST_REQUEST',
            // TODO: 
        };

        var subType = msg.read('u8');
        console.log('quest subtype', subType);

        const subTypeHandler =
        {
            MSG_QUEST_REQUEST: () => {
                const data = {
                    npcId: msg.read('i32>')
                }

                console.log('MSG_QUEST_REQUEST', data);
                session.send.quest();
            }
        }

        if(subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();
    }
}