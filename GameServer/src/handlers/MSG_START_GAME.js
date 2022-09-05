const message = require('@local/shared/message');
const log = require('@local/shared/logger');
const game = require('../game');
const util = require('../util');

const Character = require('../object/character');
const { Statistic, Position } = require('../types');
const { InventoryItem } = require('../system/inventory');

module.exports = {
    name: 'MSG_START_GAME',
    handle: function (session, msg)
    {        
        var character = new Character({
            session: session,
            progress: {
                level: 1,
                experience: 500000,
                maxExperience: 23223182, // probably will be removed later (?)
                skillpoint: 10000
            },
            stats: {
                runSpeed: new Statistic(20.0),
                health: new Statistic(10000)
            },
            nickname: "test",
            position: new Position(1111, 951, 160.3)
        });

        character.spawn();

        // character inventory
        {
            var equipment = [
                game.database.find('item', (el) => el.name == 'Warnin Heavy Shirt'),
                game.database.find('item', (el) => el.name == 'Warnin Pants'),
                game.database.find('item', (el) => el.name == 'Warnin Gauntlets'),
                game.database.find('item', (el) => el.name == 'Warnin Boots'),
                game.database.find('item', (el) => el.name == 'Warnin Helm'),
                game.database.find('item', (el) => el.name == 'Siegfried Double Sword'),
            ];

            for(var i in equipment) {
                let item = new InventoryItem({ uid: util.generateId(), item: equipment[i], plus: 15, wearing: true, count: 1, options: [ { type: 0, level: 1 },  ] });
                character.inventory.add(0, item);
            }

            session.send.inventory(character.inventory);
        }

        // send current time
        session.send.env('MSG_ENV_TIME');
        session.send.env('MSG_ENV_TAX_CHANGE');

        /*var idtest2 = 0;
        for(var i = 0; i < 8; i++)
        {
            let monster = new Monster({
                id: 40,
                zoneId: 0,
                areaId: 0,
                position: new Position(1111 - (i + 1), 965, 160.3),
            });

            game.add({ type: 'monster', zoneId: 0, data: monster });
            monster.appear(session);
            
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
                    uid: monster.uid,
                    runSpeed: 6,
                    position: {
                        'x': waypoints[idtest1 % waypoints.length].x,
                        'z': waypoints[idtest1 % waypoints.length].z,
                        'h': monster.position.h,
                        'r': monster.position.r,
                        'y': monster.position.y
                    }
                });

                idtest1 += 1;

                if(idtest1 >= waypoints.length)
                    idtest1 = 0;

            }, 1000);
        }*/

        var tospawn = game.filter('monster', (m) => m.zoneId == 0);
        for(let npc of tospawn)
        {
            for(let res of npc.result)
                res.appear(session);
        }
    
    }
}