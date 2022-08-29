const server = require("@local/shared/server");
const log = require('@local/shared/logger');
const message = require("@local/shared/message");

const state = require("./state");

const object = class
{
    // static ids
    OBJECT_CHARACTER  = 0;
    OBJECT_NPC        = 1;

    constructor({ type, id, position, character, stats })
    {
        this.uid = state.generateId();          // unique id
        this.type = type;                       // object type (character/npc)
        this.id = id;                           // object id (db char id/npcid)

        this.character = {
            'name': "",
            'classType': 0,
            'jobType': 0,
            'hairType': 0,
            'faceType': 0
        }
        
        if(this.type == this.OBJECT_CHARACTER)
            Object.assign(this.character, character)

        this.position = position || {           // FIXME: make it secure
            'zoneId': 0,
            'areaId': 0,
            'x': 0,
            'z': 0,
            'h': 0,
            'r': 0,
            'y': 0
        };

        this.stats =
        {
            'level': 1,
            
            'health': 100,
            'maxHealth': 1000,
            'mana': 100,
            'maxMana': 1000,

            'strength': 0,
            'dexterity': 0,
            'intelligence': 0,
            'condition': 0,

            'attack': 100,
            'magicAttack': 100,
            
            'defense': 100,
            'magicResist': 100,

            'experience': 0,
            'skillpoint': 0,

            'walkSpeed': 10.0,
            'runSpeed': 15.0,

            'attackSpeed': 12,
            'magicSpeed': 0,
        };

        if(stats != undefined)
            this.statistics({ action: 'update', stats });

        this.reward = {
            'experience': 100,
            'gold': 100,
            'items': []
        };

    };

    static get = ({ uid }) => {
        for (const obj of state.objects) {  
            if(obj.uid == uid) {
                return obj;
            }
        }
    };

    static update({ type, uid, value }) {
        var obj = this.get({ uid: uid });

        // FIXME: implement error handling
        if(!obj)
            return;

        if(type == 'position')
            Object.assign(obj.position, value);
        //else(type == 'stats')
        
    };

    static delete({ uid }) {
        delete state.objects[uid];
    };

    statistics({ action, data })
    {    
        if(action == 'update')
        {
            if(data != undefined)
                Object.assign(this.stats, data)

            const statusMessage = () => {            
                // MSG_STATUS
                var msg = new message({ type: 0x06 });
    
                msg.write('i32>', this.stats.level);            // Level
                msg.write('u64>', this.stats.experience);       // Current Experience
                msg.write('u64>', 23223182);                    // Max Experience
                msg.write('i32>', this.stats.health);           // Current Health Points
                msg.write('i32>', this.stats.maxHealth);        // Max Health Points
                msg.write('i32>', this.stats.mana);             // Current Mana Points
                msg.write('i32>', this.stats.maxMana);          // Max Mana Points
    
                msg.write('i32>', this.stats.strength);         // Strength
                msg.write('i32>', this.stats.dexterity);        // Dexterity
                msg.write('i32>', this.stats.intelligence);     // Intelligence
                msg.write('i32>', this.stats.condition);        // Condition
    
                msg.write('i32>', 8);                           // Added Strength
                msg.write('i32>', 0);                           // Added Dexterity
                msg.write('i32>', 0);                           // Added Intelligence
                msg.write('i32>', 0);                           // Added Condition
    
                msg.write('i32>', this.stats.attack);           // Attack
                msg.write('i32>', this.stats.magicAttack);      // Magic Attack
    
                msg.write('i32>', this.stats.defense);          // Defense
                msg.write('i32>', this.stats.magicResist);      // Magic Resist
    
                msg.write('i32>', this.stats.skillpoint);       // Skillpoint
                msg.write('i32>', 3607);                        // Weight
                msg.write('i32>', 9400);                        // Max Weight
    
                msg.write('f<', this.stats.walkSpeed);          // Walk Speed
                msg.write('f<', this.stats.runSpeed);           // Run Speed
    
                msg.write('u8', this.stats.attackSpeed);        // Attack Speed
                msg.write('u8', this.stats.magicSpeed);         // Magic Speed (?)
    
                msg.write('u8', 0);                             // PK Name
                msg.write('i32>', 0);                           // PK Penalty
                msg.write('i32>', 0);                           // PK Count
                
                return msg.build({});
            };

            server.send(statusMessage());
        };
    };

    appear = () => {
        const atMessage = () => {
            // MSG_AT
            var msg = new message({ type: 0x09 });
            
            msg.write('i32>', this.uid);                        // Unique ID
            msg.write('stringnt', this.character.name);         // Name
            msg.write('u8', this.character.classType);          // Class
            msg.write('u8', this.character.jobType);            // Job
            msg.write('u8', this.character.hairType);           // Hair
            msg.write('u8', this.character.faceType);           // Face
            msg.write('i32>', this.position.zoneId);            // Zone ID
            msg.write('i32>', this.position.areaId);            // Area ID
            msg.write('f<', this.position.x);                   // X
            msg.write('f<', this.position.z);                   // Z
            msg.write('f<', this.position.h);                   // H
            msg.write('f<', this.position.r);                   // R
            msg.write('u8', this.position.y);                   // Y LAYER
            msg.write('i32>', 1);                               // m_desc->m_index   // TODO
            msg.write('i32>', 0);                               // m_guildoutdate    // TODO

            return msg.build({ });
        }

        const appearNpcMessage = ({uid, id, isNew, position }) => {
            // MSG_APPEAR
            var msg = new message({ type: 0x07 });

            msg.write('u8', isNew | 0);                             // New
            msg.write('u8', 1);                                     // Appear Type
            msg.write('i32>', uid);                                 // Unique ID
            msg.write('i32>', parseInt(id));                        // NPC ID
            msg.write('f<', parseFloat(position.x).toFixed(1));     // X
            msg.write('f<', parseFloat(position.z).toFixed(1));     // Z
            msg.write('f<', parseFloat(position.h).toFixed(1));     // H
            msg.write('f<', parseFloat(position.r).toFixed(1));     // R
            msg.write('u8', 0);                                     // Y LAYER
            msg.write('i16>', 10000);                               // Health
            msg.write('i16>', 10000);                               // Max Health
            
            return msg.build({});
        };
        
        state.add('object', this);

        if(this.type === this.OBJECT_NPC)
        {
            log.data(`[OUT] << 'MSG_APPEAR' (0x07) [uid: ${ this.uid }, id: ${ this.id }, zone: ${ this.position.zoneId }]`);
            
            var buf = appearNpcMessage({ 
                uid: this.uid, 
                isNew: true, 
                id: this.id, 
                position: {
                    x: this.position.x,
                    z: this.position.z,
                    h: this.position.h,
                    r: this.position.r
                }
            });

            server.send(buf);
        }
        else if(this.type === this.OBJECT_CHARACTER)
        {
            log.data(`[OUT] << 'MSG_AT' (0x09)`);

            var buf = atMessage({
                uid: this.uid,
                name: 'test',
                classType: 1,
                jobType: 1,
                hair: 1,
                face: 1,
                position: {
                    zoneId: 0,
                    areaId: 0,
                    x: 1111,
                    z: 951,
                    h: 160.3,
                    r: 0,
                    u: 0
                }
            });

            server.send(buf);
            
            // send stats to server
            this.statistics({ action: 'update' });
        }
    };
}

module.exports = object;