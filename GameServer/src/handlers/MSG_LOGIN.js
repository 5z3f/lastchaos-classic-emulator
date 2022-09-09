const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_LOGIN',
    handle: function (session, msg)
    {
        var data = {
            'version': msg.read('u32>'),
            'mode': msg.read('u8'),
            'username': msg.read('stringnt'),
            'password': msg.read('stringnt'),
            'nation': msg.read('u8')
        };

        session.send.db('MSG_DB_CHAR_EXIST', { /* data */ });
        session.send.db('MSG_DB_CHAR_END');
    }
}