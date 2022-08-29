const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

const state = require('../state');
const object = require('../object');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        const data = {
            'charType': receivedMsg.read('u8'),
            'moveType': receivedMsg.read('u8'),
            'uid': receivedMsg.read('u32>'),
            'speed': receivedMsg.read('f<'),
            'x': receivedMsg.read('f<'),
            'z': receivedMsg.read('f<'),
            'h': receivedMsg.read('f<'),
            'r': receivedMsg.read('f<'),
            'y': receivedMsg.read('u8')
        }

        // sender character (client)
        var sender = object.get({ uid: data.uid });

        var posObj = {
            'x': parseFloat(data.x.toFixed(1)),
            'z': parseFloat(data.z.toFixed(1)),
            'h': parseFloat(data.h.toFixed(1)),
            'r': parseFloat(data.r.toFixed(1)),
            'y': data.y
        };

        // FIXME: logs should be debug only
        switch(data.moveType)
        {
            case 0x00: // MSG_MOVE_WALK
                log.data(`[MOVE WALK] uid: ${ data.uid } [from: (${ sender.position.x }, ${ sender.position.z }) to (${ posObj.x }, ${ posObj.z })]`)
                break;
            case 0x01: // MSG_MOVE_RUN
                log.data(`[MOVE RUN] uid: ${ data.uid } [from: (${ sender.position.x }, ${ sender.position.z }) to (${ posObj.x }, ${ posObj.z })]`)

                break;
            case 0x02: // MSG_MOVE_PLACE
                log.data(`[MOVE PLACE] uid: ${ data.uid } [from: (${ sender.position.x }, ${ sender.position.z }) to (${ posObj.x }, ${ posObj.z })]`)

                break;
            case 0x03: // MSG_MOVE_STOP
                //log.data(`[MOVE STOP] uid: ${ data.uid } [from: (${ sender.position.x }, ${ sender.position.y }) to (${ data.x }, ${ data.y })]`)
                break;

        }
        
        object.update({ type: 'position', uid: data.uid, value: posObj })
        log.data(`[OUT] << 'MSG_MOVE' (0x0C)`);
    }
}