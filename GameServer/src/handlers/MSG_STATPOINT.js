const db = require('@local/shared/db');
const log = require('@local/shared/logger');

module.exports = {
    name: 'MSG_STATPOINT',
    handle: function (session, msg)
    {
        var subType = msg.read('u8');
        var subTypeMap = {
            1: 'MSG_STATPOINT_USE',
            3: 'MSG_STATPOINT_RESET'
            // TODO: log other subtype packets as malformed
        };

        /*
            typedef enum _tagStatPointUseType
            {
                MSG_STATPOINT_USE_STR,
                MSG_STATPOINT_USE_DEX,
                MSG_STATPOINT_USE_INT,
                MSG_STATPOINT_USE_CON,
            } MSG_STATPOINT_USE_TYPE;

            typedef enum _tagStatPointErrorType
            {
                MSG_STATPOINT_ERROR_NOTENOUGH,		// Insufficient stat points
                MSG_STATPOINT_ERROR_CANTUSE,		// Stat points not available
                MSG_STATPOINT_ERROR_WRONGPACKET,	// Strange packets from the client
                MSG_STATPOINT_ERROR_NOMONEY,		// Requesting a reset with no money
            } MSG_STATPOINT_ERROR_TYPE;
        */

        const subTypeHandler =
        {
            MSG_STATPOINT_USE: async () => {
                var statpointType = msg.read('u8');

                if (session.character.statpoints < 1 || ![0, 1, 2, 3].includes(statpointType))
                    return false;

                var result;
    
                switch(statpointType) {
                    case 0: // Strength
                        session.character.statistics.strength.increase(1);
                        session.character.statistics.strengthAdded += 1;

                        result = await db.characters.increaseStatistic(session.character.id, 'strength');
                        break;
                    case 1: // Dexterity
                        session.character.statistics.dexterity.increase(1)
                        session.character.statistics.dexterityAdded += 1;

                        result = await db.characters.increaseStatistic(session.character.id, 'dexterity');
                        break;
                    case 2: // Intelligence
                        session.character.statistics.intelligence.increase(1);
                        session.character.statistics.intelligenceAdded += 1;

                        result = await db.characters.increaseStatistic(session.character.id, 'intelligence');
                        break;
                    case 3: // Condition
                        session.character.statistics.condition.increase(1);
                        session.character.statistics.conditionAdded += 1;
                        
                        result = await db.characters.increaseStatistic(session.character.id, 'condition');
                        break;
                }

                if(result) {
                    session.character.statistics.statpoints -= 1;
                    
                    session.send.statpoint(1, {
                        type: statpointType,
                        value: 1,
                        remainingPoints: session.character.statistics.statpoints
                    });

                    session.character.updateStatistics();
                }
                else {
                    session.send.fail(14); // MSG_FAIL_DB_UNKNOWN
                    return;
                }
            },
            MSG_STATPOINT_RESET: () => {

            }
        }

        if(subTypeMap[subType] in subTypeHandler)
            subTypeHandler[subTypeMap[subType]]();
    }
}