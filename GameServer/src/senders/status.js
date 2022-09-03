const message = require('@local/shared/message');

module.exports = {
    messageName: 'MSG_STATUS',
    send: function (session, msgId)
    {
        return (data) =>
        {
            var msg = new message({ type: msgId });
    
            msg.write('i32>', data.level);                  // Level
            msg.write('u64>', data.experience);             // Current Experience
            msg.write('u64>', data.maxExperience);          // Max Experience
            msg.write('i32>', data.health.total);           // Current Health Points
            msg.write('i32>', data.maxHealth.total);        // Max Health Points
            msg.write('i32>', data.mana.total);             // Current Mana Points
            msg.write('i32>', data.maxMana.total);          // Max Mana Points
            
            msg.write('i32>', data.strength.total);         // Strength
            msg.write('i32>', data.dexterity.total);        // Dexterity
            msg.write('i32>', data.intelligence.total);     // Intelligence
            msg.write('i32>', data.condition.total);        // Condition
            
            msg.write('i32>', data.strengthAdded);          // Added Strength
            msg.write('i32>', data.dexterityAdded);         // Added Dexterity
            msg.write('i32>', data.intelligenceAdded);      // Added Intelligence
            msg.write('i32>', data.conditionAdded);         // Added Condition
            
            msg.write('i32>', data.attack.total);           // Attack
            msg.write('i32>', data.magicAttack.total);      // Magic Attack
            
            msg.write('i32>', data.defense.total);          // Defense
            msg.write('i32>', data.magicResist.total);      // Magic Resist
            
            msg.write('i32>', data.skillpoint.total);       // Skillpoint

            msg.write('i32>', data.weight);                 // Weight
            msg.write('i32>', data.maxWeight);              // Max Weight
            
            msg.write('f<', data.walkSpeed.total);          // Walk Speed
            msg.write('f<', data.runSpeed.total);           // Run Speed
            
            msg.write('u8', data.attackSpeed.total);        // Attack Speed
            msg.write('u8', data.magicSpeed.total);         // Magic Speed (?)
            
            msg.write('u8', data.pkName);                   // PK Name
            msg.write('i32>', data.pkPenalty);              // PK Penalty
            msg.write('i32>', data.pkCount);                // PK Count

            msg.write('i32>', data.reputation);             // Reputation (Fame)
            msg.write('f<', data.attackRange.total);        // Attack Range
            msg.write('u8', data.meracJoinFlag);            // GetJoinFlag(ZONE_MERAC)
            msg.write('i32>', data.skillSpeed.total);       // Skill Speed
            msg.write('u8', data.mapAttr);                  // GetMapAttr()

            msg.write('u8', 0);                             // UNK1
            msg.write('u8', 0);                             // UNK2
            msg.write('i32>', 0);                           // UNK3

            session.write(msg.build({ }));
        }
    }
}