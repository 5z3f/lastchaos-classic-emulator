const Message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_AT',
    send: function (session, msgId)
    {
        return ({ uid, name, classType, jobType, hairType, faceType, zoneId, areaId, position }) =>
        {
            var msg = new Message({ type: msgId });
            
            msg.write('i32>', uid);                        // Unique ID
            msg.write('stringnt', name);                   // Name
            msg.write('u8', classType);                    // Class
            msg.write('u8', jobType);                      // Job
            msg.write('u8', hairType);                     // Hair
            msg.write('u8', faceType);                     // Face
            msg.write('i32>', zoneId);                     // Zone ID
            msg.write('i32>', areaId);                     // Area ID
            msg.write('f<', position.x);                   // X
            msg.write('f<', position.y);                   // Z
            msg.write('f<', position.z);                   // H
            msg.write('f<', position.r);                   // R
            msg.write('u8', position.layer);               // LAYER
            msg.write('i32>', 1);                          // m_desc->m_index   // TODO:
            msg.write('i32>', 0);                          // m_guildoutdate    // TODO:
    
            session.write(msg.build());            
        }
    }
}