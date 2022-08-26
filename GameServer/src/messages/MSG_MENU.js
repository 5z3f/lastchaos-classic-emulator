const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        var subType = receivedMsg.read('u8');
        
        switch(subType)
        {
            case 0x02:
            {
                // MSG_DB -> MSG_DB_OK
                const startGameMessage = () => {
                    var msg = new message({ type: 0x02, subType: 0x01 });
                    return msg.build({ clientId: receivedMsg.clientId });
                }
                
                log.data(`[OUT] << 'MSG_DB -> MSG_DB_OK' (0x02 -> 0x01)`);
                server.send(startGameMessage());    
            }
        }

    }
}