import log from '@local/shared/logger';
import Message from '@local/shared/message';
import Session from '@local/shared/session';

export default function (session: Session, msg: Message) {
    let data = {
        pulseId: msg.read('i32>'),
        nation: msg.read('u8'),
    };

    session.send.pulse();
}
