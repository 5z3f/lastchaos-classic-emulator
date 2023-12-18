import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return (data) => {
        let msg = new Message({ type: _messages.MSG_STATUS });

        msg.write('i32>', data.level);                  // Level
        msg.write('u64>', data.experience);             // Current Experience
        msg.write('u64>', data.maxExperience);          // Max Experience
        msg.write('i32>', data.health.getTotalValue());           // Current Health Points
        msg.write('i32>', data.maxHealth.getTotalValue());        // Max Health Points
        msg.write('i32>', data.mana.getTotalValue());             // Current Mana Points
        msg.write('i32>', data.maxMana.getTotalValue());          // Max Mana Points

        msg.write('i32>', data.strength.getTotalValue());         // Strength
        msg.write('i32>', data.dexterity.getTotalValue());        // Dexterity
        msg.write('i32>', data.intelligence.getTotalValue());     // Intelligence
        msg.write('i32>', data.condition.getTotalValue());        // Condition

        msg.write('i32>', data.strengthAdded);    // Added Strength
        msg.write('i32>', data.dexterityAdded);   // Added Dexterity
        msg.write('i32>', data.intelligenceAdded);// Added Intelligence
        msg.write('i32>', data.conditionAdded);   // Added Condition

        msg.write('i32>', data.attack.getTotalValue());           // Attack
        msg.write('i32>', data.magicAttack.getTotalValue());      // Magic Attack

        msg.write('i32>', data.defense.getTotalValue());          // Defense
        msg.write('i32>', data.magicResist.getTotalValue());      // Magic Resist

        msg.write('i32>', data.skillpoint);             // Skillpoint

        msg.write('i32>', data.weight);                 // Weight
        msg.write('i32>', data.maxWeight);              // Max Weight

        msg.write('f<', data.walkSpeed.getTotalValue());          // Walk Speed
        msg.write('f<', data.runSpeed.getTotalValue());           // Run Speed

        msg.write('u8', data.attackSpeed.getTotalValue());        // Attack Speed
        msg.write('u8', data.magicSpeed.getTotalValue());         // Magic Speed (?)

        msg.write('u8', data.pkName);                   // PK Name
        msg.write('i32>', data.pkPenalty);              // PK Penalty
        msg.write('i32>', data.pkCount);                // PK Count

        msg.write('i32>', data.reputation);             // Reputation (Fame)
        msg.write('f<', data.attackRange.getTotalValue());        // Attack Range
        msg.write('u8', data.meracJoinFlag);            // GetJoinFlag(ZONE_MERAC)
        msg.write('i32>', data.skillSpeed.getTotalValue());       // Skill Speed
        msg.write('u8', data.mapAttr);                  // GetMapAttr()

        msg.write('u8', 0);                             // UNK1
        msg.write('u8', 0);                             // UNK2
        msg.write('i32>', 0);                           // UNK3

        session.write(msg.build());
    }
}
