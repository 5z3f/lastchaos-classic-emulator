const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_STATUS',
    send: function (session, msgId)
    {
        return (data) =>
        {
            // MSG_STATUS
            var msg = new message({ type: msgId });
    
            msg.write('i32>', data.level);            // Level
            msg.write('u64>', data.experience);       // Current Experience
            msg.write('u64>', data.maxExperience);    // Max Experience
            msg.write('i32>', data.health);           // Current Health Points
            msg.write('i32>', data.maxHealth);        // Max Health Points
            msg.write('i32>', data.mana);             // Current Mana Points
            msg.write('i32>', data.maxMana);          // Max Mana Points
    
            msg.write('i32>', data.strength);         // Strength
            msg.write('i32>', data.dexterity);        // Dexterity
            msg.write('i32>', data.intelligence);     // Intelligence
            msg.write('i32>', data.condition);        // Condition
    
            msg.write('i32>', 8);                     // Added Strength
            msg.write('i32>', 0);                     // Added Dexterity
            msg.write('i32>', 0);                     // Added Intelligence
            msg.write('i32>', 0);                     // Added Condition
    
            msg.write('i32>', data.attack);           // Attack
            msg.write('i32>', data.magicAttack);      // Magic Attack
    
            msg.write('i32>', data.defense);          // Defense
            msg.write('i32>', data.magicResist);      // Magic Resist
    
            msg.write('i32>', data.skillpoint);       // Skillpoint
            msg.write('i32>', 3607);                  // Weight
            msg.write('i32>', 9400);                  // Max Weight
    
            msg.write('f<', data.walkSpeed);          // Walk Speed
            msg.write('f<', data.runSpeed);           // Run Speed
    
            msg.write('u8', data.attackSpeed);        // Attack Speed
            msg.write('u8', data.magicSpeed);         // Magic Speed (?)
    
            msg.write('u8', data.pkName);             // PK Name
            msg.write('i32>', data.pkPenalty);        // PK Penalty
            msg.write('i32>', data.pkCount);          // PK Count

            msg.write('i32>', data.reputation);       // Reputation (Fame)
            msg.write('f<', data.attackRange);        // Attack Range
            msg.write('u8', data.meracJoinFlag);      // GetJoinFlag(ZONE_MERAC)
            msg.write('i32>', data.skillSpeed);       // Skill Speed
            msg.write('u8', data.mapAttr);            // GetMapAttr()

            msg.write('u8', 0);                       // UNK1
            msg.write('u8', 0);                       // UNK2
            msg.write('i32>', 0);                     // UNK3

            session.write(msg.build({ }));
        }
    }
}