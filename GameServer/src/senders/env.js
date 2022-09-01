const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_ENV',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            const gameTime = (date) =>
            {
                var msg = new message({ type: msgId, subType: 2 });
    
                msg.write('i32>', date.getFullYear());
                msg.write('u8', date.getMonth() + 1);
                msg.write('u8', date.getDate());
                msg.write('u8', date.getHours());
                msg.write('u8', date.getMinutes());
                msg.write('u8', date.getSeconds());
    
                session.write(msg.build({ }));
            }

            const subTypeHandler = {
                //'MSG_ENV_TAX_CHANGE': () =>
                //'MSG_ENV_WEATHER': () =>
                'MSG_ENV_TIME': () => gameTime(new Date())
            };

            if(subType in subTypeHandler)
                subTypeHandler[subType]();
        }
    }
}