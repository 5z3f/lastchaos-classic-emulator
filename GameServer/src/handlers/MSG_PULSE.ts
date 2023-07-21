import log from '@local/shared/logger';

export default function (session, msg) {
    let data = {
        pulseId: msg.read('i32>') as number,
        nation: msg.read('u8') as number,
    };

    session.send.pulse();
}
