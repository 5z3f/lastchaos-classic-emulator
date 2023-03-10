const db = require('@local/shared/db');
const { InventoryRow } = require('../system/inventory');

const MAX_STACK = 9999;
const GOLD_ID = 19;

class item {
    /**
        Creates a new item with the given id and properties.
        
        @param {Object} options - The options for creating the item.
        @param {string} options.id - The id of the item to be created.
        @param {Object} options.owner - The owner of the item to be created.
        @param {number} [options.stack=1] - The number of items to be created.
        @param {number} [options.plus=0] - The plus value of the item to be created.
        @param {Object|null} [options.seals=null] - The seals of the item to be created.
        @param {string} [options.into='ground'] - The destination for the created item.

        @returns {number|boolean} - The uid of the created item or false if creation failed.
    */
    static async create({ id, owner, stack = 1, plus = 0, seals = null, into = 'ground' }) {
        var contentItem = game.content.find('item', (el) => el.id == id);

        if (!contentItem) {
            // TODO: item creation failed due to unknown base item id, send message to client
            return;
        }

        if(id == GOLD_ID) {
            // TODO: implement gold (maybe not here?)
            return;
        }

        // TODO: calling it should be simpler, like: contentItem.flags.stackable
        const isStackable = contentItem.flags.includes('COUNT');

        if (stack > 1 && !isStackable && owner.role == 'admin') {
            owner.session.send.chat({
                chatType: 6,
                senderId: owner.uid,
                senderName: owner.nickname,
                receiverName: owner.nickname,
                text: `This item is not stackable. You can create only one item.`
            });

            return;
        }

        if (stack >= 5000) {
            owner.session.send.chat({
                chatType: 6,
                senderId: owner.uid,
                senderName: owner.nickname,
                receiverName: owner.nickname,
                text: (stack > MAX_STACK) ? `Max allowed stack to create: ${MAX_STACK}` : `Large amount, it might take some time...`
            });

            if (stack > MAX_STACK)
                return;
        }

        var ownerPositionString = owner.position.clone().toArray().slice(0, 2).join(',');

        var itemUid = await db.items.insert({
            itemId: contentItem.id,
            accountId: owner.session.accountId,
            charId: owner.id,
            place: 0,
            position: ownerPositionString,
            plus: plus,
            seals: seals
        });

        if (!itemUid) {
            owner.session.send.fail(14); // MSG_FAIL_DB_UNKNOWN
            return;
        }

        if (stack > 1) {
            const success = db.items.insertStack({
                parentId: itemUid,
                itemId: contentItem.id,
                accountId: owner.session.accountId,
                charId: owner.id,
                place: 0,
                position: ownerPositionString,
                plus: plus,
                seals: seals
            }, (stack - 1));

            if (!success) {
                owner.session.send.fail(14); // MSG_FAIL_DB_UNKNOWN
                return;
            }
        }

        if(into == 'ground') {
            // add item to on-ground item list
            game.world.add({ type: 'item', zoneId: owner.zone.id, data: {
                uid: itemUid,
                item: contentItem,
                stack: stack,
                plus: plus,
                charUid: owner.uid,
                position: owner.position.clone() // TODO: apply radius on position
            }});
        }
        else if(into == 'inventory') {
            // create inventory row
            var invenRow = new InventoryRow({
                itemUid: itemUid,
                item: contentItem,
                plus: plus,
                stack: stack
            });

            // add row to inventory
            var rowPosition = owner.inventory.add(0, invenRow);

            if(!rowPosition) {
                owner.session.send.chat({
                    chatType: 6,
                    senderId: owner.uid,
                    senderName: owner.nickname,
                    receiverName: owner.nickname,
                    text: `Not enough space in inventory.`
                });
                return;
            }
        }

        return itemUid;
    }
}

module.exports = item;