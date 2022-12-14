const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_CHAR_STATUS',
    send: function (session, msgId)
    {
        return (data) =>
        {
            var msg = new Message({ type: msgId });
    
            msg.write('u8', data.type);
            msg.write('i32>', data.uid);
            msg.write('i32>', data.health);
            msg.write('i32>', data.maxHealth);
            msg.write('i32>', data.mana);
            msg.write('i32>', data.maxMana);

            // MSG_CHAR_PC
            if(data.type == 0) {
                msg.write('i32>', data.pkPenalty);
                msg.write('u8', data.pkName);
            }
            else {
                msg.write('i32>', 0);
                msg.write('u8', 0);
            }

            msg.write('i32>', 0); // assist m_state
            msg.write('i32>', 0); // state2 (?)

            session.write(msg.build());
        }
    }
}