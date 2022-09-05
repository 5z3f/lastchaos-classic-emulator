const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_RIGHT_ATTACK',
    send: function (session, msgId)
    {
        return ({ attackType, targetObjType, targetIndex }) =>
        {
            var msg = new message({ type: msgId });
            
            msg.write('u8', attackType);
            msg.write('u8', targetObjType);
            msg.write('i32>', targetIndex);
        
            session.write(msg.build());           
        }
    }
}