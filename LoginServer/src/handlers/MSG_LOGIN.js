const log = require('@local/shared/logger');
const db = require('@local/shared/db');

module.exports = {
    name: 'MSG_LOGIN',
    handle: async function (session, msg)
    {        
        var data = {
            'version': msg.read('u32>'),
            'mode': msg.read('u8'),
            'username': msg.read('stringnt'),
            'password': msg.read('stringnt'),
            'nation': msg.read('u8')
        }

        // TODO: check client version and if its wrong send fail message: MSG_FAIL_WRONG_VERSION

        var dbAccount = await db.accounts.getByCredentials(data.username, data.password);

        if(dbAccount === false) {
            session.send.fail(3); // MSG_FAIL_WRONG_PASSWORD
            log.data(`[IN]  >> client failed login request: [ver: ${ data.version }, username: ${ data.username }, password: ${ data.password }, nation: ${ data.nation }`);
            return;
        }
        else if(dbAccount == null) {
            session.send.fail(37); // MSG_FAIL_LOGINSERV_NO_SERVICE
            return;
        }

        session.accountId = dbAccount.id;

        log.data(`[IN]  >> client login request: [ver: ${ data.version }, username: ${ data.username }, password: ${ data.password }, nation: ${ data.nation }`);
        session.send.channelInfo();
    }
};
