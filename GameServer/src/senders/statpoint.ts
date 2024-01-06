import Message from '@local/shared/message';
import _messages from './_messages.json';
import { SendersType } from '.';
import Session from '@local/shared/session';

export default function (session: Session<SendersType>) {
    return (subType, data) => {
        let msg = new Message({ type: _messages.MSG_STATPOINT, subType: subType });

        let subTypeMap = {
            0: 'MSG_STATPOINT_REMAIN',
            1: 'MSG_STATPOINT_USE',
            2: 'MSG_STATPOINT_ERROR',
        };

        const subTypeHandler = {
            MSG_STATPOINT_REMAIN: () => {
                msg.write('i32>', data.points);
            },
            MSG_STATPOINT_USE: () => {
                msg.write('u8', data.type);
                msg.write('i32>', data.value);
                msg.write('i32>', data.remainingPoints);
            },
            MSG_STATPOINT_ERROR: () => { },
        };

        if (subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();


        session.write(msg.build());
    }
}
