import log from '@local/shared/logger';

export default function (session, msg) {
    let subType = msg.read('u8') as number;
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
