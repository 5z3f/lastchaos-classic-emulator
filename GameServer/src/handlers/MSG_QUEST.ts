import log from '@local/shared/logger';

export default function (session, msg) {
    let subTypeMap = {
        1: 'MSG_QUEST_REQUEST',
        // TODO: 
    };

    let subType = msg.read('u8') as number;
    console.log('quest subtype', subType);

    const subTypeHandler = {
        MSG_QUEST_REQUEST: () => {
            const data = {
                npcId: msg.read('i32>') as number,
            }

            console.log('MSG_QUEST_REQUEST', data);
            session.send.quest();
        }
    }

    if (subTypeMap[subType] in subTypeHandler)
        subTypeHandler[subTypeMap[subType]]();
}
