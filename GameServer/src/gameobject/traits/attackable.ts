import log from "@local/shared/logger";

class Attackable {

    damage(attacker) {
        this.statistics.health.decrease(attacker.statistics.attack.getCurrentValue());
        attacker.statistics.health.decrease(this.statistics.attack.getCurrentValue());

        log.debug(`[ATTACK] ${attacker.type}(${attacker.uid}) [HP: ${attacker.statistics.health.getCurrentValue()} | MP: ${attacker.statistics.mana.getCurrentValue()} | DMG: ${attacker.statistics.attack.getCurrentValue()}] attacked ${this.type}(${this.uid}) [HP: ${this.statistics.health.getCurrentValue()} | MP: ${this.statistics.mana.getCurrentValue()}]`);

        // damage attacker's target
        attacker.session.send.damage({
            attackerObjType: 0,
            attackerIndex: attacker.uid,
            damageType: 3,
            skillId: -1,
            targetObjType: 1,
            targetIndex: this.uid,
            targetHp: this.statistics.health.getCurrentValue(),
            targetMp: this.statistics.mana.getCurrentValue(),
            damage: attacker.statistics.attack.getCurrentValue(),
        });

        this.lastAttackTime = performance.now();

        if (this.statistics.health.getCurrentValue() <= 0) {
            this.statistics.health.set(0);

            // kill monster
            this.die();

            // remove object from attacker's visible list
            attacker.removeVisibleObject(this.type, this.uid);
        }

        // damage attacker
        attacker.session.send.damage({
            attackerObjType: 1,
            attackerIndex: this.uid,
            damageType: 0,
            skillId: -1,
            targetObjType: 0,
            targetIndex: attacker.uid,
            targetHp: attacker.statistics.health.getCurrentValue(),
            targetMp: attacker.statistics.mana.getCurrentValue(),
            damage: this.statistics.attack.getCurrentValue(),
        });

        if (attacker.statistics.health.getCurrentValue() <= 0) {
            attacker.statistics.health.set(0);
        }
    }
}


export default Attackable;
