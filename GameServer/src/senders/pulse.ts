import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return () => {
        let msg = new Message({ type: _messages.MSG_PULSE });

        msg.write('i32>', 0);       // pulse id
        msg.write('u8', 9);         // nation

        session.write(msg.build());
    }
}
