const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_FAIL',
    send: function (session, msgId)
    {
        return (subType) =>
        {
            var msg = new Message({ type: msgId, subType: subType })
            session.write(msg.build());
        }
    }
}