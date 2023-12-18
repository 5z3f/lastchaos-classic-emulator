import log from '@local/shared/logger';
import Message from '@local/shared/message';
import Session from '@local/shared/session';

export default function (session: Session, msg: Message) {
    let subType = msg.read('u8');
    let subTypeMap = {
        28: 'MSG_EX_MESSENGER',
    };

    const subTypeHandler = {
        MSG_EX_MESSENGER: () => {

        },
    }

    if (subTypeMap[subType] in subTypeHandler)
        subTypeHandler[subTypeMap[subType]]();
}
