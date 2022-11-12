
class Attackable {

    damage(attacker) {
        this.statistics.health.total -= attacker.statistics.attack.total;
        attacker.statistics.health.total -= this.statistics.attack.total;

        // damage attacker's target
        attacker.session.send.damage({
            attackerObjType: 0,
            attackerIndex: attacker.uid,
            damageType: 3,
            skillId: -1,
            targetObjType: 1,
            targetIndex: this.uid,
            targetHp: this.statistics.health.total,
            targetMp: this.statistics.mana.total,
            damage: attacker.statistics.attack.total
        });

        this.lastAttackTime = performance.now();

        if(this.statistics.health.total <= 0) {
            this.statistics.health.total = 0;

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
            targetHp: attacker.statistics.health.total,
            targetMp: attacker.statistics.mana.total,
            damage: this.statistics.attack.total
        });
        

        if(attacker.statistics.health.total <= 0) {
            attacker.statistics.health.total = 0;
        }

        console.log('damage:', attacker.uid, '->', this.uid, this.statistics.health.total);
        console.log(`target: ${ this.statistics.health.total }:${ this.statistics.mana.total } X ${ this.statistics.attack.total }`);
        console.log(`attacker: ${ attacker.statistics.health.total }:${ attacker.statistics.mana.total } X ${ attacker.statistics.attack.total }`);
    }
}


module.exports = Attackable;
