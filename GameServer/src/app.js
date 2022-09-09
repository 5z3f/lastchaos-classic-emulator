const log = require('@local/shared/logger');
const server = require("@local/shared/server");

const game = require("./game");
const Zone = require('./zone');

const Monster = require('./object/monster');
const { Position } = require('./types');

game.initialize();

var srv = new server({
    host:       '127.0.0.1',
    port:       4190,
    handlers:   require("./handlers"),
    senders:    require("./senders")
});

const initJuno = () =>
{
    var juno = new Zone(0);

    for(let n of require('../data/npc_test.json'))
    {        
        for(let s of n.spawn)
        {
            if(s.zoneId != 0 || !n.name.length)
                continue;
                
            let monster = new Monster({
                id: n.id,
                zoneId: 0,
                position: new Position(s.position.x, s.position.z, s.position.h, s.position.r, s.position.y)
            })

            juno.add('monster', monster);
            //log.info(`adding '${ n.name }' spawn`)
        }
    }

    game.world.add({ type: 'zone', data: juno });
}

initJuno();
