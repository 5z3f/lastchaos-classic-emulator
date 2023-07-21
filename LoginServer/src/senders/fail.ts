import Message from '@local/shared/message';
import _messages from './_messages.json';
import session from '@local/shared/session';

export default function (session: session) {
    return (subType: number) => {
        let msg = new Message({ type: _messages.MSG_FAIL, subType: subType })
        session.write(msg.build());
    };
}
