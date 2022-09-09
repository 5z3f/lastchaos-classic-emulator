const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_ENV',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            const taxChange = () => {
                var msg = new Message({ type: msgId, subType: 0 });

                msg.write('i32>', 0);
                msg.write('i32>', 70);
                msg.write('i32>', 20);
    
                session.write(msg.build());
            }

            const gameTime = (date) =>
            {
                var msg = new Message({ type: msgId, subType: 2 });

                msg.write('i32>', date.getFullYear() - 2001);
                msg.write('u8', date.getMonth());
                msg.write('u8', date.getDate() - 1);
                msg.write('u8', date.getHours());
                msg.write('u8', date.getMinutes());
                msg.write('u8', date.getSeconds());
    
                session.write(msg.build());
            }

            const subTypeHandler = {
                'MSG_ENV_TAX_CHANGE': () => taxChange(),
                //'MSG_ENV_WEATHER': () =>
                'MSG_ENV_TIME': () => gameTime(new Date())
            };

            if(subType in subTypeHandler)
                subTypeHandler[subType]();
        }
    }
}