import Message from '@local/shared/message';
import _messages from './_messages.json';
import { SendersType } from '.';
import Session from '@local/shared/session';

export enum SystemMessageType {
    CannotWear = 2,
    FullInventory = 3,
    Overloaded = 10,
    OverloadedWarning = 28
};

export default function (session: Session<SendersType>) {
    return (subType: SystemMessageType) => {
        let msg = new Message({ type: _messages.MSG_SYS, subType: subType })
        session.write(msg.build());
    }
}
