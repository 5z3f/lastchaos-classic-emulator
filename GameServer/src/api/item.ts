import { InventoryRow } from '../system/inventory';
import database from '../database';
import game from '../game';

const MAX_STACK = 9999;
const GOLD_ID = 19;

type ItemOptions = {
    id: number,// id of the item to be created.
    owner: any,// owner of the item to be created.
    stack?: number,// number of items to be created.
    plus?: number,// plus value of the item to be created.
    seals?: {// seals of the item to be created.
        [key: string]: number
    },
    into?: string// destination for the created item.
};

class item {
    /**
        Creates a new item with the given id and properties.
        
        @returns {number|boolean} - The uid of the created item or false if creation failed.
    */
    static async create({ id, owner, stack = 1, plus = 0, seals = undefined, into = 'ground' }: ItemOptions) {
        let contentItem = game.content.items.find((el) => el.id == id);

        if (!contentItem) {
            // TODO: item creation failed due to unknown base item id, send message to client
            return;
        }

        if (id == GOLD_ID) {
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

        let ownerPositionString = owner.position.clone().toArray().slice(0, 2).join(',');

        let itemUid = await database.items.insert({
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
            const success = database.items.insertStack({
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

        if (into == 'ground') {
            // add item to on-ground item list
            game.world.add({
                type: 'item', zoneId: owner.zone.id, data: {
                    uid: itemUid,
                    item: contentItem,
                    stack: stack,
                    plus: plus,
                    charUid: owner.uid,
                    position: owner.position.clone() // TODO: apply radius on position
                }
            });
        }
        else if (into == 'inventory') {
            // create inventory row
            let invenRow = new InventoryRow({
                itemUid: itemUid,
                item: contentItem,
                plus: plus,
                stack: stack
            });

            // add row to inventory
            let rowPosition = owner.inventory.add(0, invenRow);

            if (!rowPosition) {
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

export default item;