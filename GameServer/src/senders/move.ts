import Message from '@local/shared/message';
import _messages from './_messages.json';
import Session from '@local/shared/session';
import { SendersType } from '.';

export default function (session: Session<SendersType>) {
    return ({ objType, moveType, uid, speed, position, attribute }) => {
        let msg = new Message({ type: _messages.MSG_MOVE, subType: objType })

        msg.write('u8', moveType);
        msg.write('i32>', uid);
        msg.write('f<', speed);
        msg.write('f<', position.x);
        msg.write('f<', position.y);
        msg.write('f<', position.z);
        msg.write('f<', position.r);
        msg.write('u8', position.layer);
        msg.write('u8', attribute);             // TODO: attributepos

        session.write(msg.build());
    }
}
