const message = require('@local/shared/message');
const log = require('@local/shared/logger');
const game = require('../game');

const { Position } = require('../types');

module.exports = {
    name: 'MSG_MOVE',
    handle: function (session, msg)
    {
        const data = {
            objType: msg.read('u8'),
            moveType: msg.read('u8'),
            uid: msg.read('u32>'),
            speed: msg.read('f<'),
            x: msg.read('f<'),
            z: msg.read('f<'),
            h: msg.read('f<'),
            r: msg.read('f<'),
            y: msg.read('u8')
        };

        var moveTypeMap = {
            0: 'MSG_MOVE_WALK',
            1: 'MSG_MOVE_RUN',
            2: 'MSG_MOVE_PLACE',
            3: 'MSG_MOVE_STOP',
        };

        var character = game.find('character', (ch) => ch.uid == data.uid);

        var newPosition = new Position(
            parseFloat(data.x.toFixed(1)),
            parseFloat(data.z.toFixed(1)),
            parseFloat(data.h.toFixed(1)),
            parseFloat(data.r.toFixed(1)),
            data.y
        );

        const subTypeHandler =
        {
            MSG_MOVE_WALK: () => {
                log.data(`[MOVE WALK] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ newPosition.x }, ${ newPosition.z })]`)
            },
            MSG_MOVE_RUN: () => {
                log.data(`[MOVE RUN] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ newPosition.x }, ${ newPosition.z })]`)
            },
            MSG_MOVE_PLACE: () => {
                log.data(`[MOVE PLACE] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ newPosition.x }, ${ newPosition.z })]`)
            },
            MSG_MOVE_STOP: () => {
                log.data(`[MOVE STOP] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ newPosition.x }, ${ newPosition.z })]`)
            },
        };

        if(moveTypeMap[data.moveType] in subTypeHandler)
            subTypeHandler[moveTypeMap[data.moveType]]();

        // resend message
        //session.send.move({
        //    objType: data.objType,
        //    moveType: data.moveType,
        //    uid: data.uid,
        //    speed: character.statistics.runSpeed,
        //    position: newPosition
        //});
//
        // update character position
        character.update('position', newPosition);
    }
}