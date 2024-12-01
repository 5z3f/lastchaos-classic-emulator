import Message from '@local/shared/message';
import Session from '@local/shared/session';
import { SendersType } from '.';
import _messages from './_messages.json';

export default function (session: Session<SendersType>) {
    return (subType, data) => {
        const msg = new Message({ type: _messages.MSG_SKILL, subType: subType });

        const MSG_SKILL_LIST = 0;
        const MSG_SKILL_READY = 2;
        const MSG_SKILL_FIRE = 3;
        const MSG_SKILL_CANCEL = 4;

        const character = session.character!;

        if (subType === MSG_SKILL_LIST) {
            msg.write('u8', 1); // test 1 skill
            msg.write('i32>', data.skillId); // triple bash
            msg.write('u8', 5); // level 5
        }
        else if (subType === MSG_SKILL_READY) {      // triple bash
            msg.write('u8', data.objType);          // 0x0
            msg.write('i32>', data.objUid);        // 0x0, 0x0, 0x0, 0x8
            msg.write('i32>', data.skillId);        // 0x0, 0x0, 0x0, 0xe6,
            msg.write('u8', data.targetObjType);    // 0x1
            msg.write('i32>', data.targetUid);      // 0x0, 0x0, 0x6, 0x9b
            msg.write('i32>', 0); // skill speed    // 0x0, 0x0, 0x0, 0x0
        }
        else if (subType === MSG_SKILL_FIRE) {                   // triple bash
            msg.write('u8', data.objType);                      // 0x0
            msg.write('i32>', data.objUid);                     // 0x0, 0x0, 0x0, 0x8
            msg.write('i32>', data.skillId);                    // 0x0, 0x0, 0x0, 0xe6,
            msg.write('u8', data.targetObjType);                // 0x1
            msg.write('i32>', data.targetUid);                  // 0x0, 0x0, 0x6, 0x9b

            //
            msg.write('u8', data.targets.length);               // 0x0

            for (let i = 0; i < data.targets.length; i++) {
                msg.write('u8', data.targets[i].targetObjType); // -
                msg.write('i32>', data.targets[i].targetUid);   // -
            }

            msg.write('i32>', data.skillspeed);                           // 0x0, 0x0, 0x0, 0x0 (m_skillSpeed)
            msg.write('u8', data.ubMove);                                 // 0x0 (cMoveChar)

            const isselftmp = data.x === 0 && data.y === 0;

            msg.write('f<', isselftmp ? 0.0 : character.position.x);    // 0xe6, 0x1, 0x90, 0x44
            msg.write('f<', isselftmp ? 0.0 : character.position.y);    // 0xe1, 0x9e, 0x3e, 0x44
            msg.write('f<', isselftmp ? 0.0 : character.position.z);    // 0xb8, 0xde, 0x1e, 0x43
            msg.write('f<', isselftmp ? 0.0 : character.position.r);    // 0x31, 0x2e, 0xa4, 0xc1
            msg.write('u8', isselftmp ? 0 : character.position.layer);  // 0x0

            console.log('sent skill fire', data, msg.toString());
        }
        else if (subType === MSG_SKILL_CANCEL) {
            msg.write('u8', character.objType);
            msg.write('i32>', character.uid);
        }

        session.write(msg.build());
    }
}
