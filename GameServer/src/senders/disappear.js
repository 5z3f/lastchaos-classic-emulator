const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_DISAPPEAR',
    send: function (session, msgId)
    {
        return ({ objType, uid }) =>
        {
            var msg = new Message({ type: msgId });
            
            msg.write('u8', objType);
            msg.write('i32>', uid);

            session.write(msg.build());           
        }
    }
}