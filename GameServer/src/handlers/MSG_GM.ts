import log from '@local/shared/logger';

export default function (session, msg) {
    let subType = msg.read('u8') as number;

    let subTypeMap = {
        0: 'MSG_GM_WHOAMI',
        1: 'MSG_GM_COMMAND',
    }

    const subTypeHandler = {
        MSG_GM_WHOAMI: () => {
            session.send.gm('MSG_GM_WHOAMI');

            session.send.chat({
                chatType: 7,
                senderId: session.character.uid,
                senderName: session.character.nickname,
                receiverName: session.character.nickname,
                text: `You're admin`
            });
        },
    }

    if (subTypeMap[subType] in subTypeHandler)
        subTypeHandler[subTypeMap[subType]]();
}
