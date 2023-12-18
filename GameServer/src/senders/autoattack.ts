import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return ({ attackType, targetObjType, targetIndex }) => {
        let msg = new Message({ type: _messages.MSG_RIGHT_ATTACK });

        msg.write('u8', attackType);
        msg.write('u8', targetObjType);
        msg.write('i32>', targetIndex);

        session.write(msg.build());
    }
}
