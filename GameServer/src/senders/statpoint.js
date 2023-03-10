const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_STATPOINT',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            var msg = new Message({ type: msgId, subType: subType });

            var subTypeMap = {
                0: 'MSG_STATPOINT_REMAIN',
                1: 'MSG_STATPOINT_USE',
                2: 'MSG_STATPOINT_ERROR'
            };

            const subTypeHandler = {
                'MSG_STATPOINT_REMAIN': () => {
                    msg.write('i32>', data.points)    
                },
                'MSG_STATPOINT_USE': () => {
                    msg.write('u8', data.type);
                    msg.write('i32>', data.value);
                    msg.write('i32>', data.remainingPoints);
                },
                'MSG_STATPOINT_ERROR': () => {}
            };
                
            if(subTypeMap[subType] in subTypeHandler)
                subTypeHandler[subTypeMap[subType]]();


            session.write(msg.build());
        }
    }
}