const message = require('@local/shared/message');
const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_PULSE',
    handle: function (session, msg)
    {
        var data = {
            'pulseId': msg.read('i32>'),
            'nation': msg.read('u8')
        }

        session.send.pulse();
    }
}