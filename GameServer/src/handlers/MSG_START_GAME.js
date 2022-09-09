const log = require('@local/shared/logger');
const game = require('../game');

const Character = require('../object/character');

const { Statistic, Position } = require('../types');
const { InventoryRow } = require('../system/inventory');

module.exports = {
    name: 'MSG_START_GAME',
    handle: function (session, msg)
    {
        var character = new Character({
            session: session,
            progress: {
                level: 85,
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
                // game.database.find('item', (el) => el.name == 'pormudus jacket'),
                // game.database.find('item', (el) => el.name == 'pormudus Pants'),
                // game.database.find('item', (el) => el.name == 'Aventics Gauntlets'),
                // game.database.find('item', (el) => el.name == 'Aventics Boots'),
                // game.database.find('item', (el) => el.name == 'Poseidon helm'),
                // game.database.find('item', (el) => el.name == 'eglain dual sword'),

                game.database.find('item', (el) => el.name == 'Warnin Heavy Shirt'),
                game.database.find('item', (el) => el.name == 'Warnin Pants'),
                game.database.find('item', (el) => el.name == 'Warnin Gauntlets'),
                game.database.find('item', (el) => el.name == 'Warnin Boots'),
                game.database.find('item', (el) => el.name == 'Warnin Helm'),
                game.database.find('item', (el) => el.name == 'Siegfried Double Sword'),
            ];

            for(var i in equipment)
            {
                let row = new InventoryRow({
                    itemId: equipment[i].id,
                    plus: 15,
                    wearingPosition: equipment[i].wearingPosition,
                    count: 1,
                    options: [ { type: 0, level: 1 } ] }
                );

                character.inventory.add(0, row, false);
            }

            // additional item 1
            var item1 = game.database.find('item', (el) => el.name == 'Drun Mail Shirt');

            character.inventory.add(0, new InventoryRow({
                itemId: item1.id,
                plus: 15,
                count: 1,
                options: [ { type: 0, level: 1 } ]
            }));

            // additional item 2
            var item2 = game.database.find('item', (el) => el.name == 'Poseidon helm');

            character.inventory.add(0, new InventoryRow({
                itemId: item2.id,
                plus: 15,
                count: 1,
                options: [ { type: 0, level: 1 } ]
            }));

            session.send.inventory(character.inventory);
        }

        // send current time
        session.send.env('MSG_ENV_TIME');
        session.send.env('MSG_ENV_TAX_CHANGE');

        var tospawn = game.world.filter('monster', (m) => m.zoneId == 0);
        for(let npc of tospawn)
        {
            for(let res of npc.result)
                res.appear(session);
        }

    }
}