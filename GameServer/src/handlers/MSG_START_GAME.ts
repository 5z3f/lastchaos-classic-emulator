import log from '@local/shared/logger';
import { InventoryRow, Inventory } from '../system/inventory';
import BaseItem from '../baseobject/item';
import NPC from '../gameobject/npc';
import database from '../database';
import game from '../game';
import { GameObjectEvents } from '../gameobject';
import Message from '@local/shared/message';
import Session from '@local/shared/session';

export default async function (session: Session, msg: Message) {
    session.character.spawn();

    let visionRange = 250;

    session.character.on(GameObjectEvents.Move, (pos) => {
        let objectPoints = session.character.zone.getObjectsInArea(pos.x, pos.y, visionRange);

        for (let apo of objectPoints) {
            // TODO: currently only monster objects are supported
            if (apo.type != 'monster')
                continue;

            let obj = game.world.find(apo.type, (o) => o.uid == apo.uid);

            if (obj.state.dead)
                continue;

            //@ts-ignore
            if (session.character.isObjectVisible(apo.type, apo.uid))
                continue;

            obj.appear(session.character);
        }

        for (let objType of Object.keys(session.character.visibleObjectUids)) {
            let objectUids = session.character.visibleObjectUids[objType];

            for (let objUid of objectUids) {
                let inVisionRange = !!objectPoints.find((o) => o.type == objType && o.uid == objUid);

                // TODO: dont disappear objects that are in vision range of party members (if you are close to them - 100~150 units)
                if (!inVisionRange) {
                    //@ts-ignore
                    let o = game.world.find(objType, (o) => o.uid == objUid);

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

    let dbInventoryItems = await database.characters.getInventoryItems(session.character.id)
    let inventoryStacks: any[][] = [];

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

    for (let invenStack in inventoryStacks) {
        let inventoryStack = inventoryStacks[invenStack];
        let firstStackItem = inventoryStack[0];

        let baseItem = game.content.items.find((el) => el.id == firstStackItem.itemId);

        if (!baseItem) {
            log.debug(`Server attempted to add an item to character inventory that does not exist. ID: ${firstStackItem.itemId}`);
            continue;
        }

        let stackUids = inventoryStack.map((i) => i.id);

        let invenRow = new InventoryRow({
            itemUid: firstStackItem.id,
            item: baseItem,
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
        let equipment = [
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
    let result = game.world.filter<NPC>('npc', (n) => n.zone.id == session.character.zone.id);

    for (let npc of result)
        npc.appear(session.character.session);
}
