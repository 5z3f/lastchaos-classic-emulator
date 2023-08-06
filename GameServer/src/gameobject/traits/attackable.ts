import log from "@local/shared/logger";
import Monster from "../monster";
import Character from "../character";
import NPC from "../npc";

class Attackable {
    owner;

    constructor(owner: Character | Monster | NPC) {
        this.owner = owner;
    }

    damage(attacker: Character) {
        let owner = this.owner;
        owner.statistics.health.decrease(attacker.statistics.attack.getCurrentValue());
        attacker.statistics.health.decrease(owner.statistics.attack.getCurrentValue());

        log.debug(`[ATTACK] ${attacker.type}(${attacker.uid}) [HP: ${attacker.statistics.health.getCurrentValue()} | MP: ${attacker.statistics.mana.getCurrentValue()} | DMG: ${attacker.statistics.attack.getCurrentValue()}] attacked ${owner.type}(${owner.uid}) [HP: ${owner.statistics.health.getCurrentValue()} | MP: ${owner.statistics.mana.getCurrentValue()}]`);

        // damage attacker's target
        attacker.session.send.damage({
            attackerObjType: 0,
            attackerIndex: attacker.uid,
            damageType: 3,
            skillId: -1,
            targetObjType: 1,
            targetIndex: owner.uid,
            targetHp: owner.statistics.health.getCurrentValue(),
            targetMp: owner.statistics.mana.getCurrentValue(),
            damage: attacker.statistics.attack.getCurrentValue(),
        });

        owner.lastAttackTime = performance.now();

        if (owner.statistics.health.getCurrentValue() <= 0) {
            owner.statistics.health.set(0);

            // kill monster
            owner.die();

            // remove object from attacker's visible list
            //@ts-ignore
            attacker.removeVisibleObject(owner.type, owner.uid);
        }

        // damage attacker
        attacker.session.send.damage({
            attackerObjType: 1,
            attackerIndex: owner.uid,
            damageType: 0,
            skillId: -1,
            targetObjType: 0,
            targetIndex: attacker.uid,
            targetHp: attacker.statistics.health.getCurrentValue(),
            targetMp: attacker.statistics.mana.getCurrentValue(),
            damage: owner.statistics.attack.getCurrentValue(),
        });

        if (attacker.statistics.health.getCurrentValue() <= 0) {
            attacker.statistics.health.set(0);
        }
    }
}


export default Attackable;
