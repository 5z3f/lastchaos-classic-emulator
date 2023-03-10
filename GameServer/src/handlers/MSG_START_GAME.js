const db = require('@local/shared/db');
const log = require('@local/shared/logger');
const { InventoryRow, Inventory } = require('../system/inventory');
const game = global.game;

module.exports = {
    name: 'MSG_START_GAME',
    handle: async function (session, msg) {
        session.character.spawn();

        var visionRange = 250;

        session.character.event.on('move', (pos) => {
            var objectPoints = session.character.zone.getObjectsInArea(pos.x, pos.y, visionRange);

            for (var apo of objectPoints) {
                // TODO: currently only monster objects are supported
                if (apo.type != 'monster')
                    continue;

                var obj = game.world.find(apo.type, (o) => o.uid == apo.uid);

                if (obj.state.dead)
                    continue;

                if (session.character.isObjectVisible(apo.type, apo.uid))
                    continue;

                obj.appear(session.character);
            }

            for (var objType of Object.keys(session.character.visibleObjectUids)) {
                var objectUids = session.character.visibleObjectUids[objType];

                for (var objUid of objectUids) {
                    var inVisionRange = !!objectPoints.find((o) => o.type == objType && o.uid == objUid);

                    // TODO: dont disappear objects that are in vision range of party members (if you are close to them - 100~150 units)
                    if (!inVisionRange) {
                        var o = game.world.find(objType, (o) => o.uid == objUid);

                        // TODO: this condition will likely disappear when the character will be added to the session
                        if ((objType == 'character' && o.uid == session.character.uid) || objType == 'npc')
                            continue;

                        if (o.state.dead)
                            continue;

                        if (o?.zone.id != session.character.zone.id)
                            continue;

                        o.disappear(session.character);
                    }
                }
            }
        });

        var dbInventoryItems = await db.characters.getInventoryItems(session.character.id)
        var inventoryStacks = [];

        for (const dbInventoryItem of dbInventoryItems) {
            if (dbInventoryItem.parentId !== null) {
                if (!inventoryStacks[dbInventoryItem.parentId])
                    inventoryStacks[dbInventoryItem.parentId] = [];

                inventoryStacks[dbInventoryItem.parentId].push(dbInventoryItem);
            }
            else {
                if (!inventoryStacks[dbInventoryItem.id])
                    inventoryStacks[dbInventoryItem.id] = [];

                inventoryStacks[dbInventoryItem.id].push(dbInventoryItem);
            }
        }

        for(var invenStack in inventoryStacks) {
            var firstStackItem = inventoryStacks[invenStack][0];
            
            var contentItem = game.content.find('item', (el) => el.id == firstStackItem.itemId);

            if(!contentItem) {
                log.debug(`Server attempted to add an item to character inventory that does not exist. ID: ${ contentItem.id }`);
                continue;
            }

            var stackUids = inventoryStacks[invenStack].map((i) => i.id);
            
            var invenRow = new InventoryRow({
                itemUid: firstStackItem.id,
                item: contentItem,
                plus: firstStackItem.plus,
                stack: inventoryStacks[invenStack].length > 1 ? inventoryStacks[invenStack].length : 1,
                wearingPosition: firstStackItem.wearingPosition,
                options: firstStackItem.seals,
                stackUids: stackUids
            });

            let [tab, col, row] = firstStackItem.position.split(',');

            session.character.inventory.addToPosition({ tab, col, row }, invenRow);
        }

        session.send.inventory(session.character.inventory);

        // send stats to client
        session.character.updateStatistics();

        /*
            // FIXME: messenger related packets doesn't work for some reason

            session.send.extend(28, 8);
            session.send.friend(9, {
                uid: 9,
                nickname: 'test',
                class: 0,
                status: 0,
                group: 0
            })
        */

        /*
            var equipment = [
                game.content.find('item', (el) => el.name == 'Warnin Heavy Shirt'),
                game.content.find('item', (el) => el.name == 'Warnin Pants'),
                game.content.find('item', (el) => el.name == 'Warnin Gauntlets'),
                game.content.find('item', (el) => el.name == 'Warnin Boots'),
                game.content.find('item', (el) => el.name == 'Warnin Helm'),
                game.content.find('item', (el) => el.name == 'Siegfried Double Sword'),
            ];
        */

        // send current time
        session.send.env('MSG_ENV_TIME');
        //session.send.env('MSG_ENV_TAX_CHANGE');

        // all npcs are spawned only once per session
        var result = game.world.filter('npc', (n) => n.zone.id == session.character.zone.id);

        for (let npc of result)
            npc.appear(session.character.session);
    }
}