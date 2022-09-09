const util = require('../util');

class InventoryRow
{
    constructor({ itemUid, itemId, plus, count, wearingPosition, flag, durability, options })
    {
        this.itemUid = itemUid ?? util.generateId();
        this.itemId = itemId;

        this.wearingPosition = wearingPosition ?? 255;
        this.count = count || 1;
        this.plus = plus || 0;
        this.flag = flag || 0;
        this.durability = durability || -1;
        this.options = options || [];
    }
}

class Inventory
{
    PLATINUM_MAX_PLUS = 127;
    FLAG_ITEM_PLATINUM_GET = (a, b) => (b = a & PLATINUM_MAX_PLUS);
    FLAG_ITEM_PLATINUM_SET = (a, b)	=> (a = ( (a &~ PLATINUM_MAX_PLUS) | b ));
    FLAG_ITEM_OPTION_ENABLE = (1 << 7);
    FLAG_ITEM_SEALED = (1 << 8);
    FLAG_ITEM_SUPER_STONE_USED = (1 << 9);
    FLAG_ITEM_BOOSTER_ADDED = (1 << 10);
    FLAG_ITEM_SILVERBOOSTER_ADDED = (1 << 11);
    FLAG_ITEM_GOLDBOOSTER_ADDED = (1 << 12);
    FLAG_ITEM_PLATINUMBOOSTER_ADDED = (1 << 13);
    FLAG_ITEM_COMPOSITION = (1 << 14);
    FLAG_ITEM_LENT = (1 << 15);
    FLAG_ITEM_LEVELDOWN = (1 << 16);

    MAX_TABS = 3;
    MAX_COLUMNS = 20;
    MAX_ROWS = 5;

    TAB_DEFAULT = 0;
    TAB_QUEST = 1;
    TAB_EVENT = 2;

    constructor({ owner }) {
        this.owner = owner;
        this.items = Array.from(Array(this.MAX_TABS), () => Array.from(Array(this.MAX_COLUMNS), () => new Array(this.MAX_ROWS)));
    }

    find(tab, opts)
    {
        var result = null;

        for(var col = 0; col < this.MAX_COLUMNS; col++)
        {
            var row = this.items[tab][col].findIndex(opts);

            if(row != -1)
            {
                result = {
                    position: {
                        tab: tab,
                        col: col,
                        row: row
                     },
                     data: this.items[tab][col][row]
                };

                break;
            }
        }

        return result;
    }

    findEmptyRow(tab)
    {
        var result = null;

        for(var col = 0; col < this.MAX_COLUMNS; col++)
        {
            var row = this.items[tab][col].findIndex((i) => (typeof i === "undefined"));

            if(row != -1)
            {
                result = {
                    tab: tab,
                    col: col,
                    row: row
                };

                break;
            }
        }

        return result;
    }

    add(tab, item, sendMsg)
    {
        sendMsg = (sendMsg == undefined || !!sendMsg) ? true : false;

        var result = this.findEmptyRow(tab);

        if(result == null) {
            this.owner.session.send.sys(3); // MSG_SYS_FULL_INVENTORY
            return false;
        }

        this.items[tab][result.col][result.row] = item;

        var pos = {
            position: {
                tab: tab,
                col: result.col,
                row: result.row
            }
        };

        if(sendMsg)
            // send item to client
            this.owner.session.send.item('MSG_ITEM_ADD', { ...item, ...pos });

        return pos;
    }

    swap(tab, src, dst)
    {    
        var srcRow = this.items[tab][src.position.col][src.position.row];
        var dstRow = this.items[tab][dst.position.col][dst.position.row];

        // TODO: packet seems to be malformed, better log it in the future
        if(src.uid != srcRow.itemUid)
            return false;

        if(srcRow == undefined || (dst.uid != -1 && dstRow == undefined))
            return false;
        
        this.items[tab][src.position.col][src.position.row] = dstRow;
        this.items[tab][dst.position.col][dst.position.row] = srcRow;

        // send swap to client
        this.owner.session.send.item('MSG_ITEM_SWAP', { tab, src, dst });

        return true;
    }

    update(position, opts)
    {
        if(opts != undefined)
            Object.assign(this.items[position.tab][position.col][position.row], opts);
    }

    unequip(position)
    {
        var result = null;

        for(var col = 0; col < this.MAX_COLUMNS; col++)
        {
            var row = this.items[this.TAB_DEFAULT][col].findIndex((i) => (i?.wearingPosition == position));

            if(row != -1)
            {
                this.items[this.TAB_DEFAULT][col][row].wearingPosition = 255;

                result = {
                    position: {
                        tab: this.TAB_DEFAULT,
                        col: col,
                        row: row
                    },
                    data: this.items[this.TAB_DEFAULT][col][row]
                };
            }
        }

        return result;
    }

    get() {
        return this.items;
    }
}

module.exports = { Inventory, InventoryRow };