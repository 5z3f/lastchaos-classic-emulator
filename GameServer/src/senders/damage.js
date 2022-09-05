const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_DAMAGE',
    send: function (session, msgId)
    {
        return ({ attackerObjType, attackerIndex, damageType, skillId, targetObjType, targetIndex, targetHp, targetMp, damage }) =>
        {
            var msg = new message({ type: msgId });
            
            msg.write('u8', attackerObjType);
            msg.write('i32>', attackerIndex);
            msg.write('u8', damageType);
            msg.write('i32>', skillId);
            msg.write('u8', targetObjType);
            msg.write('i32>', targetIndex);
            msg.write('i32>', targetHp);
            msg.write('i32>', targetMp);
            msg.write('i32>', damage);

            switch (damageType)
            {
                case 0: // MSG_DAMAGE_MELEE
                case 1: // MSG_DAMAGE_RANGE
                case 2: // MSG_DAMAGE_MAGIC
                    msg.write('u8', 5); // m_attackSpeed
                    break;
                default:
                    msg.write('u8', 0); // m_attackSpeed
                    break;
            }

            msg.write('u8', 1) // damage flag: dodge (0), hit (1), critical (2)
        
            session.write(msg.build());           
        }
    }
}