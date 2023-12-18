import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return (subType, data) => {
        let msg = new Message({ type: _messages.MSG_EFFECT, subType: subType });

        let subTypeMap = {
            0: 'MSG_EFFECT_SKILL',
            1: 'MSG_EFFECT_ETC',
            2: 'MSG_EFFECT_PRODUCE',
            3: 'MSG_EFFECT_ITEM',
            4: 'MSG_EFFECT_FIRE',

        };

        const subTypeHandler = {
            MSG_EFFECT_SKILL: () => {
                msg.write('i32>', data.skillId);
                msg.write('u8', data.objType);
                msg.write('i32>', data.charUid);
            },
            MSG_EFFECT_ETC: () => {
                msg.write('u8', data.objType);
                msg.write('i32>', data.charUid);
                msg.write('u8', data.effectType);
            },
            MSG_EFFECT_PRODUCE: () => {
                msg.write('u8', data.kind);
                msg.write('u8', data.objType);
                msg.write('i32>', data.charUid);
                msg.write('u8', data.targetObjType);
                msg.write('i32>', data.targetUid);
                msg.write('i32>', data.health);
            },
            MSG_EFFECT_ITEM: () => {
                msg.write('u8', data.objType);
                msg.write('i32>', data.charUid);
                msg.write('i32>', data.itemId);
            },
            MSG_EFFECT_FIRE: () => {

            },
        };

        if (subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();

        session.write(msg.build());
    }
}
