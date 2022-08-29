const log = require('@local/shared/logger');
const server = require('@local/shared/server');
const message = require('@local/shared/message');

module.exports = {
    onReceive: (receivedMsg) =>
    {
        var subType = receivedMsg.read('u8');
        log.data(`MSG_GM SUB TYPE >> '${ subType }'`);

        switch(subType)
        {
            case 0x00:
            {
                log.data('RECEIVED WHOAMI');
                
                const gmWhoamiMessage = ({ level }) => {
                    // MSG_GM -> MSG_GM_WHOAMI
                    var msg = new message({ type: 0x17, subType: 0x00 });
                    msg.write('u8', level) // level
                    
                    return msg.build({ });
                }

                server.send(gmWhoamiMessage({ level: 10 }));

                // FIXME: redeclaration
                const chatMessage = ({ chatType, senderId, senderName, receiverName, text }) => {
                    // MSG_CHAT
                    var msg = new message({ type: 0x0F });
                    
                    msg.write('u8', chatType);
        
                    msg.write('i32>', senderId);            // senderId
                    msg.write('stringnt', senderName);      // senderName
                    msg.write('stringnt', receiverName);    // receiverName
                    msg.write('stringnt', text);            // text
        
                    return msg.build({ });
                }
                
                server.send(chatMessage({
                    chatType: 9, // MSG_CHAT_GM
                    senderId: 0,
                    senderName: '',
                    receiverName: '',
                    text: 'whoami',
                }));
            }
        }
    }
}