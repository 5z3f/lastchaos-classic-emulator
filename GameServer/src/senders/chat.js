const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_CHAT',
    send: function (session, msgId)
    {
        return ({ chatType, senderId, senderName, receiverName, text }) =>
        {
            var msg = new Message({ type: msgId });
            
            msg.write('u8', chatType);
    
            msg.write('i32>', senderId);            // senderId (Unique ID)
            msg.write('stringnt', senderName);      // senderName
            msg.write('stringnt', receiverName);    // receiverName
            msg.write('stringnt', text);            // text
    
            session.write(msg.build());           
        }
    }
}