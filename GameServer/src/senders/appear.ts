import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return (subType, data) => {
        // TODO:
        const appearCharacter = () => {
            let msg = new Message({ type: _messages.MSG_APPEAR });

            msg.write('u8', 1);             // new
            msg.write('u8', 0);             // m_type
            msg.write('i32>', 1);           // m_index
            msg.write('stringnt', 'test');  // name
            msg.write('u8', 1);             // m_job
            msg.write('u8', 1);             // hairstyle
            msg.write('u8', 1);             // facestyle

            msg.write('f<', 1255);          // X
            msg.write('f<', 341);           // Z
            msg.write('f<', 160);           // H
            msg.write('f<', 0);             // R
            msg.write('u8', 0);             // Y LAYER

            msg.write('i16>', 100);         // hp
            msg.write('i16>', 1000);        // maxhp

            msg.write('u8', 0);             // player state
            msg.write('i32>', 0);           // pkpenalty
            msg.write('u8', 0);             // getpkname

            let armor = [75, 34, 48, 38, 49, 39, 41];
            let plus = [15, 15, 15, 15, 15, 15, 15];

            for (let i = 1; i <= 6; ++i) {
                msg.write('i32>', armor[i - 1]);
                msg.write('i32>', plus[i - 1]);
            }

            msg.write('i32>', 0);           // assist state
            msg.write('u8', 1);             // assist count

            for (let i = 0; i < 1; i++) {
                msg.write('i32>', -1);
                msg.write('i32>', -1);
                msg.write('u8', 0);
                msg.write('i32>', -1);
            }

            for (let i = 0; i < 1; i++) {
                msg.write('i32>', -1);
                msg.write('i32>', -1);
                msg.write('u8', 0);
                msg.write('i32>', -1);
            }

            msg.write('u8', 0);                     // personal shop mode
            msg.write('stringnt', '');              // title

            msg.write('i32>', -1);                     // guild id
            msg.write('stringnt', '');              // guild name

            msg.write('i32>', -1);                     // 
            msg.write('i32>', -1);                     // 

            session.write(msg.build());
        }

        const appearNpc = ({ uid, id, firstAppearance, position, health, maxHealth }) => {
            let msg = new Message({ type: _messages.MSG_APPEAR });

            msg.write('u8', firstAppearance);   // New
            msg.write('u8', 1);                 // Appear Type
            msg.write('i32>', uid);             // Unique ID
            msg.write('i32>', id);              // NPC ID
            msg.write('f<', position.x);        // X
            msg.write('f<', position.y);        // Z
            msg.write('f<', position.z);        // H
            msg.write('f<', position.r);        // R
            msg.write('u8', position.layer);    // LAYER
            msg.write('i32>', health);    // Health
            msg.write('i32>', maxHealth); // Max Health
            msg.write('i32>', 0);               // Assist State
            msg.write('u8', 0);                 // Assist Count
            msg.write('u8', 0);                 // Attribute Position

            session.write(msg.build());
        };

        const subTypeHandler = {
            character: () => appearCharacter(data),
            npc: () => appearNpc(data),
            monster: () => appearNpc(data),
        };

        if (subType in subTypeHandler)
            subTypeHandler[subType]();
    }
}
