import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return ({ chatType, senderId, senderName, receiverName, text }) => {
        let msg = new Message({ type: _messages.MSG_CHAT, subType: chatType });

        msg.write('i32>', senderId);            // senderId (Unique ID)
        msg.write('stringnt', senderName);      // senderName
        msg.write('stringnt', receiverName);    // receiverName
        msg.write('stringnt', text);            // text

        session.write(msg.build());
    }
}
