const message = require('@local/shared/message');
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
        }

        log.data(`[IN]  >> client login request: [ver: ${ data.version }, username: ${ data.username }, password: ${ data.password }, nation: ${ data.nation }`);
        session.send.channelInfo();
    }
}