import log from '@local/shared/logger';
import Message from '@local/shared/message';
import session from '@local/shared/session';
import app from '../app';
import database from '../database';

export default async function (session: session, msg: Message) {
    let data = {
        version: msg.read('u32>'),
        mode: msg.read('u8'),
        username: msg.read('stringnt'),
        password: msg.read('stringnt'),
        nation: msg.read('u8'),
    }

    // TODO: check client version and if its wrong send fail message: MSG_FAIL_WRONG_VERSION

    let dbAccount = await database.accounts.getByCredentials(data.username, data.password);

    if (dbAccount === false) {
        session.send.fail(3); // MSG_FAIL_WRONG_PASSWORD
        log.data(`[IN]  >> client failed login request: [ver: ${data.version}, username: ${data.username}, password: ${data.password}, nation: ${data.nation}`);
        return;
    }
    else if (dbAccount == null) {
        session.send.fail(37); // MSG_FAIL_LOGINSERV_NO_SERVICE
        return;
    }

    // pair session with user account
    session.pinAccount(dbAccount.id);

    log.data(`[IN]  >> client login request: [ver: ${data.version}, username: ${data.username}, password: ${data.password}, nation: ${data.nation}`);
    session.send.channelInfo();
}
