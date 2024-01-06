# Buff System
Allows you to apply temporary (or not) statistic effects to characters.
# Buff Scripts
A buff script is a JavaScript object that defines the properties and behavior of a buff. It has the following properties:

- `id`: A unique identifier for the buff.
- `name`: The name of the buff.
- `description`: A description of what the buff does.
- `duration`: How long the buff lasts.
- `apply`: A function that is called when the buff is applied. It should return an array of pairs, where each pair is a statistic and a modifier.
- `remove`: A function that is called when the buff is removed.

# Example Usage - the hardcode way

```ts
import { Buff, BuffOrigin } from "./buff";
import { Modifier, ModifierType, ModifierEffectType, Statistic } from "./statistic";

const attackPotionModifier = new Modifier(
    ModifierType.Additive, 100, ModifierEffectType.Instant
);

const buff = new Buff(
    character, // The character to apply the buff to
    BuffOrigin.Item, // The origin of the buff
    attackPotionBaseItem, // The reference of the buff, can be either a string or class reference like BaseItem (very recommended)
    [[character.statistics.attack, attackPotionModifier]], // The statistics to modify
    300, // The duration of the buff in seconds
);

character.buffs.add(buff);
```

# Example Usage - using buff scripts

```ts
import Character from "../../src/gameobject/character";
import api from "../../src/api";
import { Modifier, ModifierEffectType, ModifierType } from "../../src/system/core/statistic";

const attackPotionModifier = new Modifier(
    ModifierType.Additive, 100, ModifierEffectType.Instant
);

export default {
    id: 328, // value[0] of BaseItem atm, can be also array
    name: 'Attack Potion',
    description: 'Increases attack by 100 for 5 minutes',
    duration: '5 minutes', // also can be a number (seconds)
    apply: (character: Character, level: number) => {
        api.chat.system(character, 'You have used an Attack Potion.');
        
        return [
            [character.statistics.attack, attackPotionModifier]
        ];
    },
    remove: (character: Character) => {
        api.chat.system(character, 'Your Attack Potion has expired.');
    },
}
```

### **Currently you can run script only by using an item** 