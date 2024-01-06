import Message from '@local/shared/message';
import _messages from './_messages.json';
import Session from '@local/shared/session';
import { SendersType } from '.';

export default function (session: Session<SendersType>) {
    return ({ objType, uid }) => {
        let msg = new Message({ type: _messages.MSG_DISAPPEAR });

        msg.write('u8', objType);
        msg.write('i32>', uid);

        session.write(msg.build());
    }
}
