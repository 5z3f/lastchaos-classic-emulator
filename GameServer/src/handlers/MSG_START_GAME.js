const log = require('@local/shared/logger');
const game = global.game;

const Character = require('../gameobject/character');

const { Statistic, Position } = require('../types');
const { InventoryRow } = require('../system/inventory');

module.exports = {
    name: 'MSG_START_GAME',
    handle: function (session, msg)
    {
        var juno = game.world.get('zone', 0);

        var character = new Character({
            session: session,
            uid: session.uid,
            id: 1,
            classType: 1,
            jobType: 0,
            zone: juno,
            areaId: 0,
            appearance: {
                hairType: 2,
                faceType: 2
            },
            progress: {
                level: 85,
                experience: 500000,
                maxExperience: 23223182, // probably will be removed later (?)
                skillpoint: 100000
            },
            statistics: {
                runSpeed: new Statistic(20.0),
                health: new Statistic(1000),
                maxHealth: new Statistic(1000),
                mana: new Statistic(1000),
                maxMana: new Statistic(1000),
                strength: new Statistic(100),
                dexterity: new Statistic(100),
                intelligence: new Statistic(100),
                condition: new Statistic(100),
                attack: new Statistic(100),
                magicAttack: new Statistic(100),
                defense: new Statistic(100),
                magicResist: new Statistic(100),
                walkSpeed: new Statistic(10.0),
                attackRange: new Statistic(2.3),
                attackSpeed: new Statistic(10.0),
            },
            nickname: 'test',
            position: new Position(1111, 951, 160.3)
        });

        var visionRange = 250;

        character.event.on('move', (pos) => {
            var objectPoints = character.zone.getObjectInArea(pos.x, pos.y, visionRange);

            for(var apo of objectPoints) {
                // TODO: currently only monster objects are supported
                if(apo.type != 'monster')
                    continue;

                var obj = game.world.find(apo.type, (o) => o.uid == apo.uid);

                if(obj.state.dead)
                    continue;

                if(character.isObjectVisible(apo.type, apo.uid))
                    continue;

                obj.appear(character);
            }
            
            for(var objType of Object.keys(character.visibleObjectUids)) {
                var objectUids = character.visibleObjectUids[objType];

                for(var objUid of objectUids) {
                    var inVisionRange = !!objectPoints.find((o) => o.type == objType && o.uid == objUid);

                    // TODO: dont disappear objects that are in vision range of party members (if you are close to them - 100~150 units)
                    if(!inVisionRange) {
                        var o = game.world.find(objType, (o) => o.uid == objUid);

                        // TODO: this condition will likely disappear when the character will be added to the session
                        if((objType == 'character' && o.uid == character.uid) || objType == 'npc')
                            continue;
                        
                        if(o.state.dead)
                            continue;

                        if(o?.zone.id != character.zone.id)
                            continue;

                        o.disappear(character);
                    }
                }
            }
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

            for(var item of equipment) {
                let row = new InventoryRow({
                    itemId: item.id,    
                    plus: 15,
                    wearingPosition: item.wearingPosition,
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
        //session.send.env('MSG_ENV_TAX_CHANGE');

        // all npcs are spawned only once per session
        var result = game.world.filter('npc', (n) => n.zone.id == character.zone.id);

        for(let npc of result) {
            npc.appear(character.session);
        }
    }
}