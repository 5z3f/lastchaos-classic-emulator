const EventEmitter = require('events');
const server = require("@local/shared/server");
const log = require('@local/shared/logger');
const message = require("@local/shared/message");

const state = require("./state");

const object = class
{
    // static ids
    OBJECT_CHARACTER  = 0;
    OBJECT_NPC        = 1;

    constructor({ uid, type, id, position, character, stats, reward })
    {
        this.uid = uid ?? state.generateId();   // unique id
        this.type = type;                       // object type (character/npc)
        this.id = id;                           // object id (db char id/npcid)

        this.character = {
            'name': "",
            'classType': 0,
            'jobType': 0,
            'hairType': 0,
            'faceType': 0
        };
        
        if(this.type == this.OBJECT_CHARACTER)
            Object.assign(this.character, character);

        this.position = position || {           // FIXME: make it secure
            'zoneId': 0,
            'areaId': 0,
            'x': 1111,
            'z': 951,
            'h': 160.3,
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
            'maxExperience': 23223182,
            'skillpoint': 0,

            'walkSpeed': 10.0,
            'runSpeed': 15.0,

            'attackSpeed': 10,
            'magicSpeed': 0,
            
            'pkName': 0,
            'pkPenalty': 0,
            'pkCount': 0,
            
            'reputation': 0,
            'attackRange': 2.3,

            'meracJoinFlag': 0,
            'skillSpeed': 1,
            'mapAttr': 0,
            
            // TODO
        };

        if(stats != undefined)
            Object.assign(this.stats, stats);


        this.reward = {
            'experience': 100,
            'gold': 100,
            'items': []
        };

        if(reward != undefined)
            Object.assign(this.reward, reward);


        this.event = new EventEmitter();
    };

    static get = ({ uid }) => {
        for (const obj of state.objects) {  
            if(obj.uid == uid) {
                return obj;
            }
        }
    };

    update = ({ session, type, data }) =>
    {
        if(type == 'position')
        {
            // FIXME: implement error handling
            if(data != undefined)                
                Object.assign(this.position, data);

            session.send.move({
                objType: this.type,
                uid: this.uid,
                moveType: 1, // TODO
                runSpeed: this.stats.runSpeed,
                position: {
                    x: this.position.x,
                    z: this.position.z,
                    h: this.position.h,
                    r: this.position.r,
                    y: this.position.y
                }
            })

            this.event.emit('move', data);
        }
        else if(type == 'stats')
        {
            // FIXME: implement error handling
            if(data != undefined)                
                Object.assign(this.stats, data);

            session.send.status(this.stats);
        }
        
    };

    static delete({ uid }) {
        delete state.objects[uid];
    };
    
    appear = (session) =>
    {
        // this.event = new EventEmitter();
        state.add('object', this);

        if(this.type === this.OBJECT_NPC)
        {
            log.data(`[OUT] << 'MSG_APPEAR' (0x07) [uid: ${ this.uid }, id: ${ this.id }, zone: ${ this.position.zoneId }]`);
            
            session.send.appear('NPC', { 
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
        }
        else if(this.type === this.OBJECT_CHARACTER)
        {
            log.data(`[OUT] << 'MSG_AT' (0x09)`);

            session.send.at({
                uid: this.uid,
                name: this.character.name,
                classType: this.character.classType,
                jobType: this.character.jobType,
                hairType: this.character.hairType,
                faceType: this.character.faceType,
                position: {
                    zoneId: this.position.zoneId,
                    areaId: this.position.areaId,
                    x: this.position.x,
                    z: this.position.z,
                    h: this.position.h,
                    r: this.position.r,
                    y: this.position.y,
                }
            });
            
            // send stats to client
            this.update({ session: session, type: 'stats' });
        }
    };
}

module.exports = object;