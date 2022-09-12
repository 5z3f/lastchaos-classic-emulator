const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_MOVE',
    send: function (session, msgId)
    {
        return ({ objType, moveType, uid, speed, position }) =>
        {
            var msg = new Message({ type: msgId, subType: objType })
            
            msg.write('u8', moveType);
            msg.write('i32>', uid);
            msg.write('f<', speed);
            msg.write('f<', position.x);
            msg.write('f<', position.y);
            msg.write('f<', position.z);
            msg.write('f<', position.r);
            msg.write('u8', position.layer);
            msg.write('u8', 0);             // TODO: attributepos

            session.write(msg.build());
        }
    }
}