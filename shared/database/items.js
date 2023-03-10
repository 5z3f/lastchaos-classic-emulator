const log = require('../logger');

class items {
    constructor(db) {
        this.db = db;
    }

    /**
        Inserts a new virtual item into the database.
        @param {Object} options - The options object.
        @param {number} options.itemId - The ID of the item to be inserted.
        @param {number} options.accountId - The ID of the account to which the item belongs.
        @param {number} options.charId - The ID of the character who owns the item.
        @param {string} options.place - The location where the item is placed.
        @param {number} options.position - The position of the item in the location.
        @param {number} [options.plus=0] - The plus value of the item.
        @param {number} [options.seals=null] - The number of seals on the item.
        @param {number} [options.parentId=null] - The ID of the parent item, if any.
        @returns {number|null} The ID of the newly inserted item, or null if there was an error.
    */
    async insert({ itemId, accountId, charId, place, position, plus = 0, seals = null, parentId = null }) {
        const newItemQuery = `
            INSERT INTO items (itemId, accountId, charId, place, position, plus, seals, parentId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        try {
            const result = await this.db.execute(newItemQuery, [
                itemId,
                accountId,
                charId,
                place,
                position,
                plus,
                seals,
                parentId
            ]);

            return result.insertId;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async insertStack({ itemId, accountId, charId, place, position, plus, seals, parentId }, stack) {
        const values = [
            itemId,
            accountId,
            charId,
            place,
            `"${position}"`,
            plus ?? 'NULL',
            seals ?? 'NULL',
            parentId ?? 'NULL'
        ];
            
        var queryArray = [];

        for(var i = 0; i < stack; i++)
            queryArray.push(`INSERT INTO items (itemId, accountId, charId, place, position, plus, seals, parentId) VALUES (${values.join(', ')});`);
        
        try {
            const result = await this.db.query(queryArray.join(''));
            return result.insertId;
        }
        catch(error) {
            log.error(error);
            return null;
        }
    }

    async update({ where, data }) {
        var k = Object.keys(data);
        var v = Object.values(data);

        var updateItemQuery = `
            UPDATE items
            SET ${k.map((key) => `${key}=?`)}
            WHERE ${Object.keys(where).map((key) => `${key}=?`).join(' AND ')}
        `;

        const result = await this.db.execute(updateItemQuery, [...v, ...Object.values(where)]);
        return result;
    }
}

module.exports = items;