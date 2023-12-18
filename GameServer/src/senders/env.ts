import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return (subType, data) => {
        const taxChange = () => {
            let msg = new Message({ type: _messages.MSG_ENV, subType: 0 });

            msg.write('i32>', 0);
            msg.write('i32>', 70);
            msg.write('i32>', 20);

            session.write(msg.build());
        }

        const gameTime = (date) => {
            let msg = new Message({ type: _messages.MSG_ENV, subType: 2 });

            msg.write('i32>', date.getFullYear() - 2001);
            msg.write('u8', date.getMonth());
            msg.write('u8', date.getDate() - 1);
            msg.write('u8', date.getHours());
            msg.write('u8', date.getMinutes());
            msg.write('u8', date.getSeconds());

            session.write(msg.build());
        }

        const subTypeHandler = {
            MSG_ENV_TAX_CHANGE: () => taxChange(),
            //MSG_ENV_WEATHER: () =>
            MSG_ENV_TIME: () => gameTime(new Date()),
        };

        if (subType in subTypeHandler)
            subTypeHandler[subType]();
    }
}
