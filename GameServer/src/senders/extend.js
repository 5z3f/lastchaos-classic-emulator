const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_EXTEND',
    send: function (session, msgId)
    {
        return (subType, thirdType) =>
        {
            var msg = new Message({ type: msgId, subType: subType });

            var subTypeMap = {
                28: 'MSG_EX_MESSENGER',
            };

            const subTypeHandler = {
                'MSG_EX_MESSENGER': () => {
                    const MSG_EX_MESSENGER_GROUP_LIST = 8;

                    msg.write('u8', thirdType);

                    if(thirdType == MSG_EX_MESSENGER_GROUP_LIST) {
                        // FIXME: this packet doesn't work for some reason
                        msg.write('i32>', 2);                   // group count
                        msg.write('i32>', 0);                   // group id
                        msg.write('stringnt', 'testgroup');     // group name
                    }        
                },
            };

            if(subTypeMap[subType] in subTypeHandler)
                subTypeHandler[subTypeMap[subType]]();

            session.write(msg.build());
        }
    }
}