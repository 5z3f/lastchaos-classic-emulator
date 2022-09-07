const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_SYS',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            var msg = new message({ type: msgId, subType: subType })
            session.write(msg.build());
        }
    }
}