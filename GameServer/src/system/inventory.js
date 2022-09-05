
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

    constructor() {
        this.items = Array.from(Array(this.MAX_TABS), () => Array.from(Array(this.MAX_COLUMNS), () => new Array(this.MAX_ROWS)));
    }

    findEmptyRow(tab)
    {
        var result = null;

        for(var col = 0; col < this.MAX_COLUMNS; col++)
        {
            var row = this.items[tab][col].findIndex((el) => (typeof el === "undefined"));

            if(row != -1) {
                result = [col, row];
                break;
            }
        }

        return result;
    }

    add(tab, item) {
        var result = this.findEmptyRow(tab);

        // TODO: if result is null raise not enough slot message

        this.items[tab][result[0]][result[1]] = item;
    }

    swap(tab, item1, item2) {
        
    }

    get() {
        return this.items;
    }
}

module.exports = { Inventory, InventoryItem };