import log from '@local/shared/logger';
import Message from '@local/shared/message';
import session from '@local/shared/session';
import app from '../app';


export default async function (session: session, msg: Message) {
    let data = {
        version: msg.read('u32>') as number,
        mode: msg.read('u8') as number,
        username: msg.read('stringnt') as string,
        password: msg.read('stringnt') as string,
        nation: msg.read('u8') as number,
    }

    // TODO: check client version and if its wrong send fail message: MSG_FAIL_WRONG_VERSION

    let dbAccount = await app.database.accounts.getByCredentials(data.username, data.password);

    if (dbAccount === false) {
        session.send.fail(3); // MSG_FAIL_WRONG_PASSWORD
        log.data(`[IN]  >> client failed login request: [ver: ${data.version}, username: ${data.username}, password: ${data.password}, nation: ${data.nation}`);
        return;
    }
    else if (dbAccount == null) {
        session.send.fail(37); // MSG_FAIL_LOGINSERV_NO_SERVICE
        return;
    }

    session.accountId = dbAccount.id;

    log.data(`[IN]  >> client login request: [ver: ${data.version}, username: ${data.username}, password: ${data.password}, nation: ${data.nation}`);
    session.send.channelInfo();
}
