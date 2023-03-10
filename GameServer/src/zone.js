const { QuadTree, Box } = require('js-quadtree');

const fs = require('fs');
const path = require('path');
const SmartBuffer = require('smart-buffer').SmartBuffer;

const Monster = require('./gameobject/monster');
const NPC = require('./gameobject/npc');

const { Statistic, Modifier, ModifierType } = require('./types/statistic');

class Zone {
    // TODO: move this?
    AttributeFlags = {
        0:      'FIELD',      
        10:     'PEACEZONE', 
        20:     'PRODUCT_PUBLIC',
        30:     'PRODUCT_PRIVATE',
        40:     'STAIR_UP',
        50:     'STAIR_DOWN',
        60:     'WARZONE',
        70:     'FREEPKZONE',
        255:    'BLOCK',
    }

    npcs = [];
    monsters = [];
    characters = [];
    items = []; // on ground

    constructor(id, width, height) {
        this.id = id ?? -1;

        this.width = width;
        this.height = height;

        this.attributeMap = Array.from(Array(width), e => Array(height));
        this.heightMap = Array.from(Array(width), e => Array(height));
        
        this.quadTree = new QuadTree(new Box(0, 0, width, height), {
            capacity: 64,
            arePointsEqual: (p1, p2) => {
                return (p1.uid === p2.uid && p1.x === p2.x && p1.y === p2.y);
            }
        });

        this.load();
    }

    load() {
        for(var baseMonster of global.game.content.monsters) {
            for(var spawn of baseMonster.spawns) {
                if(spawn.zoneId != this.id)
                    continue;
                
                var monster = new Monster({
                    id: baseMonster.id,
                    flags: baseMonster.flags,
                    level: baseMonster.level,
                    zone: this,
                    position: spawn.position,
                    respawnTime: spawn.respawnTime * 1000,
                    statistics: {
                        health:         new Statistic(baseMonster.statistics.health),
                        maxHealth:      new Statistic(baseMonster.statistics.health),
                        mana:           new Statistic(baseMonster.statistics.mana),
                        maxMana:        new Statistic(baseMonster.statistics.mana),
                        strength:       new Statistic(baseMonster.statistics.strength),
                        dexterity:      new Statistic(baseMonster.statistics.dexterity),
                        intelligence:   new Statistic(baseMonster.statistics.intelligence),
                        condition:      new Statistic(baseMonster.statistics.condition),
                        attack:         new Statistic(baseMonster.statistics.attack),
                        magicAttack:    new Statistic(baseMonster.statistics.magicAttack),
                        defense:        new Statistic(baseMonster.statistics.defense),
                        magicResist:    new Statistic(baseMonster.statistics.magicResist),
                        walkSpeed:      new Statistic(baseMonster.statistics.walkSpeed),
                        runSpeed:       new Statistic(baseMonster.statistics.runSpeed),
                        attackRange:    new Statistic(baseMonster.statistics.attackRange),
                        attackSpeed:    new Statistic(baseMonster.statistics.attackSpeed),                    
                    }
                });

                this.add('monster', monster);
            }
        }

        for(var baseNPC of game.content.npcs) {
            for(var spawn of baseNPC.spawns) {
                if(spawn.zoneId != this.id)
                    continue;
                
                var n = new NPC({
                    id: baseNPC.id,
                    zone: this,
                    flags: baseNPC.flags,
                    level: baseNPC.level,
                    statistics: {
                        health:         new Statistic(baseNPC.statistics.health),
                        maxHealth:      new Statistic(baseNPC.statistics.health),
                        mana:           new Statistic(baseNPC.statistics.mana),
                        maxMana:        new Statistic(baseNPC.statistics.mana),
                        strength:       new Statistic(baseNPC.statistics.strength),
                        dexterity:      new Statistic(baseNPC.statistics.dexterity),
                        intelligence:   new Statistic(baseNPC.statistics.intelligence),
                        condition:      new Statistic(baseNPC.statistics.condition),
                        attack:         new Statistic(baseNPC.statistics.attack),
                        magicAttack:    new Statistic(baseNPC.statistics.magicAttack),
                        defense:        new Statistic(baseNPC.statistics.defense),
                        magicResist:    new Statistic(baseNPC.statistics.magicResist),
                        walkSpeed:      new Statistic(baseNPC.statistics.walkSpeed),
                        runSpeed:       new Statistic(baseNPC.statistics.runSpeed),
                        attackRange:    new Statistic(baseNPC.statistics.attackRange),
                        attackSpeed:    new Statistic(baseNPC.statistics.attackSpeed),                    
                    },
                    position: spawn.position
                });

                this.add('npc', n);
            }
        }

        // read height map
        var heightData = fs.readFileSync(path.dirname(__filename) + `/../data/maps/${ this.id }.sht`);
        const reader1 = SmartBuffer.fromBuffer(heightData);

        for (var h = 0; h < this.height; h++)
            for (var w = 0; w < this.width; w++)
                this.heightMap[w][h] = reader1.readUInt16BE() / 100.0;

        // read attribute map
        var attrData = fs.readFileSync(path.dirname(__filename) + `/../data/maps/${ this.id }.sat`);
        const reader2 = SmartBuffer.fromBuffer(attrData);

        var flagsKeys = Object.keys(this.AttributeFlags);
        for (var h = 0; h < this.height; h++) {
            for (var w = 0; w < this.width; w++) {
                var val = reader2.readUInt8();
                this.attributeMap[w][h] = flagsKeys.includes(String(val)) ? val : 255;
            }
        }

    }

    getObjectsInArea(x, y, range) {
        x -= Math.floor(range / 2);
        y -= Math.floor(range / 2);

        return this.quadTree.query(new Box(x, y, range, range));
    }

    add(type, data) {
        // return if object doesn't have unique identifier
        if(!('uid' in data))
            return;

        switch(type) {
            case 'character':
                var found = this.characters.find((ch) => ch.uid == data.uid);
                
                if(found)
                    return;

                this.quadTree.insert({
                    x: data.position.x,
                    y: data.position.y,
                    uid: data.uid,
                    type: 'character',
                    character: data
                });

                this.characters.push(data);
                break;
            case 'npc':
                var found = this.npcs.findIndex((n) => n.uid == data.uid);
                
                if(found != -1)
                    return;

                this.quadTree.insert({
                    x: data.position.x,
                    y: data.position.y,
                    uid: data.uid,
                    type: 'npc'
                });

                this.npcs.push(data);
                break;
            case 'monster':
                var found = this.npcs.findIndex((m) => m.uid == data.uid);

                if(found != -1)
                    return;

                this.quadTree.insert({
                    x: data.position.x,
                    y: data.position.y,
                    uid: data.uid,
                    type: 'monster'
                });

                this.monsters.push(data);
                break;
            case 'item':
                var found = this.npcs.findIndex((i) => i.uid == data.uid);
                
                if(found != -1)
                    return;

                this.quadTree.insert({
                    x: data.position.x,
                    y: data.position.y,
                    uid: data.uid,
                    type: 'item'
                });

                this.items.push(data);
                break;
        }
    }

    find(type, opts) {
        switch(type) {
            case 'character':
                return this.characters.find(opts);
            case 'npc':
                return this.npcs.find(opts);
            case 'monster':
                return this.monsters.find(opts);
            case 'item':
                return this.items.find(opts);
        }
    }

    filter(type, opts) {
        switch(type) {
            case 'character':
                return this.characters.filter(opts);
            case 'npc':
                return this.npcs.filter(opts);
            case 'monster':
                return this.monsters.filter(opts);
            case 'item':
                return this.items.filter(opts);
        }
    }

    // TODO: this is not the best way, but sufficient for now
    remove(type, opts) {
        switch(type) {
            case 'character':
                this.characters = this.characters.filter(opts);
                break;
            case 'npc':
                this.npcs = this.npcs.filter(opts);
                break;
            case 'monster':
                this.monsters = this.monsters.filter(opts);
                break;
            case 'item':
                this.items = this.items.filter(opts);
                break;
        }
    }

    getAttribute(position, asText) {
        var x = parseInt(position.x);
        var y = parseInt(position.y);

        if(x < 0 || x >= this.width || y < 0 || y >= this.height)
            return !!asText ? this.AttributeFlags[255] : 255;

        return !!asText ? this.AttributeFlags[this.attributeMap[x][y]] : this.attributeMap[x][y];
    }

    getHeight(position) {
        var x = parseInt(position.x);
        var y = parseInt(position.y);

        if(x < 0 || x >= this.width || y < 0 || y >= this.height)
            return 0;

        return this.heightMap[x][y];
    }
}

module.exports = Zone;
