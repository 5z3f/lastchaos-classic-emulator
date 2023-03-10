const db = require('@local/shared/db');
const log = require('@local/shared/logger');
const messenger = require('../system/messenger');

module.exports = {
    name: 'MSG_FRIEND',
    handle: function (session, msg)
    {
        var subType = msg.read('u8');
        console.log('MSG_FRIEND -> ', subType)

        var subTypeMap = {
            1: 'MSG_FRIEND_REGISTER_REQUEST',
            2: 'MSG_FRIEND_REGISTER_ALLOW'
        }

        const MSG_FRIEND_ERROR = 0;
        const MSG_FRIEND_REGISTER_REQUEST = 1;
        const MSG_FRIEND_REGISTER_MEMBER_NOTIFY = 7;
        const MSG_FRIEND_MEMBERLIST = 9;

        /*
            // FIXME: this is not working
        */

        const subTypeHandler =
        {
            MSG_FRIEND_REGISTER_REQUEST: async () => {
                var requesterUid = msg.read('i32>');
                var receiverName = msg.read('stringnt');
                console.log(requesterUid, receiverName, session.character.uid);

                if(receiverName.length < 2 || receiverName.length > 16) {
                    session.send.friend(MSG_FRIEND_ERROR, 9); // MSG_FRIEND_ERROR_FRIENDNAME
                    return;
                }
                
                // TODO: packet is malformed, log it
                if(requesterUid != session.character.uid) {
                    session.send.friend(MSG_FRIEND_ERROR, 2); // MSG_FRIEND_ERROR_NOT_EXIST
                    return;
                }

                var receiverCharacter = game.world.find('character', (ch) => ch.nickname === receiverName);

                if(!receiverCharacter) {
                    session.send.friend(MSG_FRIEND_ERROR, 2); // MSG_FRIEND_ERROR_NOT_EXIST
                    return;
                }

                if(messenger.invite.find(receiverCharacter.id)) {
                    session.send.friend(MSG_FRIEND_ERROR, 5); // MSG_FRIEND_ERROR_WAIT_OTHER
                    return;
                }

                // TODO: check if they're already friends

                messenger.invite.create(session.character.id, receiverCharacter.id);

                // resend to receiver
                receiverCharacter.session.send.friend(MSG_FRIEND_REGISTER_REQUEST, { requesterUid, receiverName });
            },
            MSG_FRIEND_REGISTER_ALLOW: async () => {
                var receiverUid = msg.read('i32>');
                var receiverName = msg.read('stringnt');

                // TODO: packet is malformed, log it
                if(receiverUid != session.character.uid) {
                    session.send.friend(MSG_FRIEND_ERROR, 2); // MSG_FRIEND_ERROR_NOT_EXIST
                    return;
                }

                if(!messenger.invite.find(session.character.id)) {
                    session.send.friend(MSG_FRIEND_ERROR, 1); // MSG_FRIEND_ERROR_PACKET
                    return;
                }

                var acceptedInvite = messenger.invite.accept(session.character.id);
                if(!acceptedInvite) {
                    session.send.friend(MSG_FRIEND_ERROR, 1); // MSG_FRIEND_ERROR_PACKET
                    return;
                }

                const result = await db.messenger.createFriend(acceptedInvite);

                if (!result) {
                    session.send.fail(14); // MSG_FAIL_DB_UNKNOWN
                    return;
                }
                
                var requesterCharacter = game.world.find('character', (ch) => ch.id === acceptedInvite.requester);

                session.send.friend(MSG_FRIEND_REGISTER_MEMBER_NOTIFY, {
                    uid: requesterCharacter.uid,
                    nickname: requesterCharacter.nickname,
                    class: requesterCharacter.classType,
                    status: 1
                });

                requesterCharacter.session.send.friend(MSG_FRIEND_REGISTER_MEMBER_NOTIFY, {
                    uid: session.character.uid,
                    nickname: session.character.nickname,
                    class: session.character.classType,
                    status: 1
                });
            }
        }

        if(subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();
    }
}