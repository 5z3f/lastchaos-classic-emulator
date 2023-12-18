import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return ({ objType, uid }) => {
        let msg = new Message({ type: _messages.MSG_DISAPPEAR });

        msg.write('u8', objType);
        msg.write('i32>', uid);

        session.write(msg.build());
    }
}
