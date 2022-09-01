const message = require('@local/shared/message');
const log = require('@local/shared/logger');
const object = require('../object');

module.exports = {
    name: 'MSG_START_GAME',
    handle: function (session, msg)
    {
        // spawn character
        var obj = new object({
            uid: session.uid,
            type: 0,
            position: {
                'zoneId': 0,
                'areaId': 0,
                'x': 1111,
                'z': 951,
                'h': 160,
                'r': 0,
                'y': 0
            },
            character: {
                'name': 'test',
                'classType': 1,
                'jobType': 1,
                'hairType': 2,
                'faceType': 2,
            }
        });
        
        obj.appear(session);

        // send current time
        session.send.env('MSG_ENV_TIME');

        var idtest2 = 0;
        for(var i = 0; i < 8; i++)
        {
            // create test object
            let npc = new object({
                type: 1,
                id: 40,
                position: {
                    'zoneId': 0,
                    'areaId': 0,
                    'x': 1116 - (i + 1),
                    'z': 965,
                    'h': 160,
                    'r': 0,
                    'y': 0
                }
            });

            npc.appear(session);
            
            let idtest1 = idtest2++;

            var waypoints = [
                { x: 1121, z: 948 },
                { x: 1121, z: 955 },
                { x: 1116, z: 961 },
                { x: 1108, z: 961 },
                { x: 1102, z: 955 },
                { x: 1102, z: 948 },
                { x: 1107, z: 942 },
                { x: 1115, z: 942 }
            ];

            var intervalId = setInterval(function() {
                session.send.move({
                    objType: 1,
                    moveType: 1,
                    uid: npc.uid,
                    runSpeed: 6,
                    position: {
                        'x': waypoints[idtest1 % waypoints.length].x,
                        'z': waypoints[idtest1 % waypoints.length].z,
                        'h': npc.position.h,
                        'r': npc.position.r,
                        'y': npc.position.y
                    }
                });

                idtest1 += 1;

                if(idtest1 >= waypoints.length)
                    idtest1 = 0;

            }, 1000)

        }
        
    }
}