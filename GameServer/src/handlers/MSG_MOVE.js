const message = require('@local/shared/message');
const log = require('@local/shared/logger');
const object = require('../object');

module.exports = {
    name: 'MSG_MOVE',
    handle: function (session, msg)
    {
        var moveTypeMap = {
            0: 'MSG_MOVE_WALK',
            1: 'MSG_MOVE_RUN',
            2: 'MSG_MOVE_PLACE',
            3: 'MSG_MOVE_STOP',
        };

        const data = {
            'charType': msg.read('u8'),
            'moveType': msg.read('u8'),
            'uid': msg.read('u32>'),
            'speed': msg.read('f<'),
            'x': msg.read('f<'),
            'z': msg.read('f<'),
            'h': msg.read('f<'),
            'r': msg.read('f<'),
            'y': msg.read('u8')
        }
                
        var character = object.get({ uid: data.uid });

        var pos = {
            'x': parseFloat(data.x.toFixed(1)),
            'z': parseFloat(data.z.toFixed(1)),
            'h': parseFloat(data.h.toFixed(1)),
            'r': parseFloat(data.r.toFixed(1)),
            'y': data.y
        };

        const subTypeHandler =
        {
            MSG_MOVE_WALK: () => {
                log.data(`[MOVE WALK] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ pos.x }, ${ pos.z })]`)
            },
            MSG_MOVE_RUN: () => {
                log.data(`[MOVE RUN] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ pos.x }, ${ pos.z })]`)
                session.send.move({
                    objType: 0,
                    moveType: 1,
                    uid: data.uid,
                    runSpeed: 6.0,
                    position: {
                        x: pos.x + 100.0,
                        z: pos.z + 100.0,
                        h: pos.h,
                        r: pos.r,
                        y: pos.y,
                    }
                })
            },
            MSG_MOVE_PLACE: () => {
                log.data(`[MOVE PLACE] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ pos.x }, ${ pos.z })]`)
            },
            MSG_MOVE_STOP: () => {
                log.data(`[MOVE STOP] uid: ${ data.uid } [from: (${ character.position.x }, ${ character.position.z }) to (${ pos.x }, ${ pos.z })]`)
            },
        };

        if(moveTypeMap[data.moveType] in subTypeHandler)
            subTypeHandler[moveTypeMap[data.moveType]]();

        // update character position
        character.update({ session: session, type: 'position', data: pos })
    }
}