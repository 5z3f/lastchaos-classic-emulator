const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_AT',
    send: function (session, msgId)
    {
        return (data) =>
        {
            // MSG_AT
            var msg = new message({ type: msgId });
            
            msg.write('i32>', data.uid);                        // Unique ID
            msg.write('stringnt', data.name);                   // Name
            msg.write('u8', data.classType);                    // Class
            msg.write('u8', data.jobType);                      // Job
            msg.write('u8', data.hairType);                     // Hair
            msg.write('u8', data.faceType);                     // Face
            msg.write('i32>', data.position.zoneId);            // Zone ID
            msg.write('i32>', data.position.areaId);            // Area ID
            msg.write('f<', data.position.x);                   // X
            msg.write('f<', data.position.z);                   // Z
            msg.write('f<', data.position.h);                   // H
            msg.write('f<', data.position.r);                   // R
            msg.write('u8', data.position.y);                   // Y LAYER
            msg.write('i32>', 1);                               // m_desc->m_index   // TODO:
            msg.write('i32>', 0);                               // m_guildoutdate    // TODO:
    
            session.write(msg.build({ }));            
        }
    }
}