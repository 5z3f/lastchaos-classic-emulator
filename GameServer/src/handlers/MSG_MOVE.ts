import log from '@local/shared/logger';
import game from '../game';

import { Position } from '../types';
import Message from '@local/shared/message';
import Session from '@local/shared/session';

export default function (session: Session, msg: Message) {
    const data = {
        objType: msg.read('u8'),
        moveType: msg.read('u8'),
        uid: msg.read('u32>'),
        speed: msg.read('f<'),
        x: msg.read('f<'),
        y: msg.read('f<'),
        z: msg.read('f<'),
        r: msg.read('f<'),
        layer: msg.read('u8'),
    };

    let moveTypeMap = {
        0: 'MSG_MOVE_WALK',
        1: 'MSG_MOVE_RUN',
        2: 'MSG_MOVE_PLACE',
        3: 'MSG_MOVE_STOP',
    };

    let character = session.character;
    if (!character)
        return;

    if (character.uid != data.uid) {
        // TODO: sorcerer summoners
        // else cheating ?
        return;
    }

    let newPosition = new Position(
        parseFloat(data.x.toFixed(1)),
        parseFloat(data.y.toFixed(1)),
        parseFloat(data.z.toFixed(1)),
        parseFloat(data.r.toFixed(1)),
        data.layer
    );

    const subTypeHandler = {
        MSG_MOVE_WALK: () => {
            //log.data(`[MOVE WALK] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.y }) to (${ newPosition.x }, ${ newPosition.y })]`)
        },
        MSG_MOVE_RUN: () => {
            //log.data(`[MOVE RUN] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.y }) to (${ newPosition.x }, ${ newPosition.y })]`)
        },
        MSG_MOVE_PLACE: () => {
            //log.data(`[MOVE PLACE] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.y }) to (${ newPosition.x }, ${ newPosition.y })]`)
        },
        MSG_MOVE_STOP: () => {
            //log.data(`[MOVE STOP] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.y }) to (${ newPosition.x }, ${ newPosition.y })]`)
        },
    };

    if (moveTypeMap[data.moveType] in subTypeHandler)
        subTypeHandler[moveTypeMap[data.moveType]]();

    // FIXME: This approach is wrong, server side movement simulation is needed
    character.updatePosition(newPosition);
}
