const log = require('@local/shared/logger');
const game = global.game;

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

        var character = game.world.find('character', (ch) => ch.uid == data.attackerIndex);
        var monster = game.world.find('monster', (m) => m.uid == data.targetIndex);

        if(!monster) {
            return console.debug(`monster which doesn't exist has been attacked`);
        }
            
        monster.damage(character);
    }
}