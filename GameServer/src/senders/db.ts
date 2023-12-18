import Message from '@local/shared/message';
import _messages from './_messages.json';

const WEAR_COUNT = 7;

export default function (session) {
    return (subType, data) => {
        const characterExists = ([dbCharacter, wearingItems]) => {
            // MSG_DB -> MSG_DB_CHAR_EXIST
            let msg = new Message({ type: _messages.MSG_DB, subType: 2 });

            msg.write('i32>', dbCharacter.id);             // Character ID (UID)
            msg.write('stringnt', dbCharacter.nickname);   // Nickname
            msg.write('u8', dbCharacter.class);            // Class
            msg.write('u8', dbCharacter.profession || 0);  // Profession
            msg.write('u8', dbCharacter.hair);             // Hair
            msg.write('u8', dbCharacter.face);             // Face
            msg.write('i32>', dbCharacter.level);          // Level
            msg.write('u64>', dbCharacter.experience);     // Current Experience
            msg.write('u64>', 100);                        // TODO: Max Experience
            msg.write('i32>', dbCharacter.skillpoints);    // Skill Points
            msg.write('i32>', dbCharacter.health);         // TODO: Current Health Points
            msg.write('i32>', dbCharacter.health);         // Max Health Points
            msg.write('i32>', dbCharacter.mana);           // Current Mana Points
            msg.write('i32>', dbCharacter.mana);           // TODOMax Mana Points

            for (let pos = 0; pos < WEAR_COUNT; pos++) {
                let item = wearingItems.find((i) => i.wearingPosition == pos);

                msg.write('i32>', item?.itemId || -1);
                msg.write('i32>', item?.plus || 0);
            }

            msg.write('i32>', -1);              // Remain Character Delete Time

            session.write(msg.build());
        }

        const characterExistEnd = () => {
            // MSG_DB -> MSG_DB_CHAR_END
            let msg = new Message({ type: _messages.MSG_DB, subType: 3 });
            session.write(msg.build());
        }

        const startGame = () => {
            let msg = new Message({ type: _messages.MSG_DB, subType: 1 });
            session.write(msg.build());
        }

        const subTypeHandler = {
            //MSG_DB_SUCCESS: 0,
            MSG_DB_OK: () => startGame(),
            MSG_DB_CHAR_EXIST: (data) => characterExists(data),
            MSG_DB_CHAR_END: () => characterExistEnd(),
            //MSG_DB_OTHER_SERVER: 4,
        };

        if (subType in subTypeHandler)
            subTypeHandler[subType](data);
    }
}
