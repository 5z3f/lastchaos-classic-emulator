const message = require('@local/shared/message');
const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_ATTACK',
    handle: function (session, msg)
    {
        var data = {
            'attackerObjType': msg.read('u8'),
            'attackerIndex': msg.read('i32>'),
            'targetObjType': msg.read('u8'),
            'targetIndex': msg.read('i32>'),
            'attackType': msg.read('u8'),
            'multicount': msg.read('u8')
        };

        log.debug(`[ATTACK] (uid: ${ data.attackerIndex } >> uid: ${ data.targetIndex})`);

        session.send.attack({
            attackerObjType: data.targetObjType,
            attackerIndex: data.targetIndex,
            targetObjType: data.attackerObjType,
            targetIndex: data.attackerIndex,
            attackType: 3   // MSG_DAMAGE_MELEE
        })

        session.send.damage({
            attackerObjType: data.targetObjType,
            attackerIndex: data.targetIndex,
            damageType: 3,
            skillId: -1,
            targetObjType: data.attackerObjType,
            targetIndex: data.attackerIndex,
            targetHp: 1000,
            targetMp: 1000,
            damage: 300
        })
    }
}