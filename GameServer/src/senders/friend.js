const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_FRIEND',
    send: function (session, msgId)
    {
        return (subType, data) =>
        {
            var msg = new Message({ type: msgId, subType: subType });

            const MSG_FRIEND_ERROR = 0;
            const MSG_FRIEND_REGISTER_REQUEST = 1;
            const MSG_FRIEND_REGISTER_MEMBER_NOTIFY = 7;
            const MSG_FRIEND_MEMBERLIST = 9;

            if(subType === MSG_FRIEND_ERROR) {
                msg.write('i8', data);
            }
            else if(subType === MSG_FRIEND_REGISTER_REQUEST) {
                msg.write('i32>', data.requesterIndex);
                msg.write('stringnt', data.receiverName);
            }
            else if(subType === MSG_FRIEND_REGISTER_MEMBER_NOTIFY) {
                // FIXME: this packet doesn't work for some reason
                msg.write('i32>', data.uid);
                msg.write('stringnt', data.nickname);
                msg.write('i32>', data.class);
                msg.write('i32>', data.status);
            }
            else if(subType == MSG_FRIEND_MEMBERLIST) {
                // FIXME: this packet doesn't work for some reason
                msg.write('i32>', data.uid);
                msg.write('stringnt', data.nickname);
                msg.write('i32>', data.class);
                msg.write('i32>', data.status);
                msg.write('i32>', data.group);
            }

            session.write(msg.build());
            console.log(msg.toString())
        }
    }
}