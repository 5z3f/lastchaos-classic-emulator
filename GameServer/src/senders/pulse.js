const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_PULSE',
    send: function (session, msgId)
    {
        return () =>
        {
            var msg = new message({ type: msgId });

            msg.write('i32>', 0);       // pulse id
            msg.write('u8', 9);         // nation

            session.write(msg.build());
        }
    }
}