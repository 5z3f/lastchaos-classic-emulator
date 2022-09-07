
class InventoryItem
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

    constructor({ uid, item, plus, count, wearing, flag, options })
    {
        this.uid = uid || -1;

        this.item = item;
        this.wearing = wearing;
        this.count = count || 1;
        this.plus = plus || 0;
        this.flag = flag || 0;
        this.options = options || [];
    }
}

class Inventory
{
    MAX_TABS = 3;
    MAX_COLUMNS = 20;
    MAX_ROWS = 5;

    TAB_DEFAULT = 0;
    TAB_QUEST = 1;
    TAB_EVENT = 2;

    constructor() {
        this.items = Array.from(Array(this.MAX_TABS), () => Array.from(Array(this.MAX_COLUMNS), () => new Array(this.MAX_ROWS)));
    }

    find(tab, opts)
    {
        var result = null;

        for(var col = 0; col < this.MAX_COLUMNS; col++)
        {
            var row = this.items[tab][col].findIndex(opts);

            if(row != -1) {
                result = { col: col, row: row, item: this.items[tab][col][row] };
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

            if(row != -1) {
                result = [col, row];
                break;
            }
        }

        return result;
    }

    add(tab, item)
    {
        var result = this.findEmptyRow(tab);

        // TODO: if result is null raise not enough slot message

        this.items[tab][result[0]][result[1]] = item;

        // return InventoryItem and its position on which it was added
        return { tab: tab, col: result[0], row: result[1], inventoryItem: item };
    }

    swap(tab, src, dst)
    {    
        var srcRow = this.items[tab][src.col][src.row];
        var dstRow = this.items[tab][dst.col][dst.row];

        if(srcRow == undefined || src.uid != srcRow.uid || (dst.uid != -1 && dstRow == undefined))
            return false;
        
        this.items[tab][src.col][src.row] = dstRow;
        this.items[tab][dst.col][dst.row] = srcRow;

        return true;
    }

    update(tab, col, row, opts) {
        if(opts != undefined)
            Object.assign(this.items[tab][col][row], opts);
    }

    unequip(position)
    {
        var result = null;

        for(var col = 0; col < this.MAX_COLUMNS; col++)
        {
            var row = this.items[this.TAB_DEFAULT][col].findIndex((i) => (i?.wearing && i?.item.wearingPosition == position));

            if(row != -1) {
                this.items[this.TAB_DEFAULT][col][row].wearing = false;
                result = { col: col, row: row, item: this.items[this.TAB_DEFAULT][col][row] };
            }
        }

        return result;
    }

    get() {
        return this.items;
    }
}

module.exports = { Inventory, InventoryItem };