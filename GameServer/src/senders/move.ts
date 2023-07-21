import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return ({ objType, moveType, uid, speed, position }) => {
        let msg = new Message({ type: _messages.MSG_MOVE, subType: objType })

        msg.write('u8', moveType);
        msg.write('i32>', uid);
        msg.write('f<', speed);
        msg.write('f<', position.x);
        msg.write('f<', position.y);
        msg.write('f<', position.z);
        msg.write('f<', position.r);
        msg.write('u8', position.layer);
        msg.write('u8', 0);             // TODO: attributepos

        session.write(msg.build());
    }
}
