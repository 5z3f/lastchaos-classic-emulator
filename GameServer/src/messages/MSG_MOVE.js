const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        const data = {
            'charType': receivedMsg.read('u8'),
            'moveType': receivedMsg.read('u8'),
            'charId': receivedMsg.read('u32>'),
            'X': receivedMsg.read('f<'),
            'Z': receivedMsg.read('f<'),
            'H': receivedMsg.read('f<'),
            'R': receivedMsg.read('f<'),
            'Y': receivedMsg.read('u8')
        }

        // console.log(data)
        log.data(`[OUT] << 'MSG_MOVE' (0x0C)`);
    }
}