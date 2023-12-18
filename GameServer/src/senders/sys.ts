import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return (subType) => {
        let msg = new Message({ type: _messages.MSG_SYS, subType: subType })
        session.write(msg.build());
    }
}
