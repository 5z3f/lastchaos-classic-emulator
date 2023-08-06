import log from '@local/shared/logger';
import game from '../game';

import { Position } from '../types';

export default function (session, msg) {
    const data = {
        objType: msg.read('u8') as number,
        moveType: msg.read('u8') as number,
        uid: msg.read('u32>') as number,
        speed: msg.read('f<') as number,
        x: msg.read('f<') as number,
        y: msg.read('f<') as number,
        z: msg.read('f<') as number,
        r: msg.read('f<') as number,
        layer: msg.read('u8') as number,
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
