const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_LOGINSERV_PLAYER',
    send: function (session, msgId)
    {
        return (data) =>
        {
            var msg = new Message({ type: msgId });
        
            msg.write('i32>', 1);                           // recentServer
            msg.write('i32>', 1);                           // recentSubNum
            msg.write('i32>', 1);                           // connectorCount
            msg.write('i32>', 1);                           // connectorId
            msg.write('i32>', 1);                           // serverNo
            msg.write('i32>', 1);                           // maxServer
            msg.write('u8', 1);                             // recommendServer
            msg.write('i32>', 1);                           // serverSubNo
            msg.write('i32>', 50 + 1999);                   // playerCount
            msg.write('stringnt', config.gameserver.host);  // ipAddress
            msg.write('i32>', config.gameserver.port);      // port
            
            session.write(msg.build());
        }
    }
};
