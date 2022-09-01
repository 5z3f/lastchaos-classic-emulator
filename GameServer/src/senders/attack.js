const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_ATTACK',
    send: function (session, msgId)
    {
        return ({ attackerObjType, attackerIndex, targetObjType, targetIndex, attackType, multicount }) =>
        {
            var msg = new message({ type: msgId });
            
            msg.write('u8', attackerObjType);
            msg.write('i32>', attackerIndex);
            msg.write('u8', targetObjType);
            msg.write('i32>', targetIndex);
            msg.write('u8', attackType);
            msg.write('u8', multicount ?? 0); // private dungeon
            //msg.write('i32>', targetIndex); // private dungeon
        
            session.write(msg.build({ }));
        }
    }
}