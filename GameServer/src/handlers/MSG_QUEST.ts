import log from '@local/shared/logger';
import Message from '@local/shared/message';
import Session from '@local/shared/session';

export default function (session: Session, msg: Message) {
    let subTypeMap = {
        1: 'MSG_QUEST_REQUEST',
        // TODO: 
    };

    let subType = msg.read('u8');
    console.log('quest subtype', subType);

    const subTypeHandler = {
        MSG_QUEST_REQUEST: () => {
            const data = {
                npcId: msg.read('i32>'),
            }

            console.log('MSG_QUEST_REQUEST', data);
            session.send.quest();
        }
    }

    if (subTypeMap[subType] in subTypeHandler)
        subTypeHandler[subTypeMap[subType]]();
}
