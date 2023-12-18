enum ModifierType {
    ADDITIVE = 0,
    PERCENTUAL = 1,
    MULTIPLICATOR = 2,
    DIVISOR = 3,
    NEGATIVE = 4
};

enum ModifierOrigin {
    STAT = 0,
    ITEM = 1,
    BUFF = 2,
    SKILL = 3,
    COMMAND = 4,
};

/**
 * A class representing a statistic in game, such as health or strength.
 */
class Statistic {

    /**
     * The base value of the statistic.
     */
    baseValue = 0;

    /**
     * The total value of the statistic.
     */
    totalValue = 0;

    /**
     * The minimum value of the statistic.
    */
    minValue = 0;

    /**
     * The maximum value of the statistic.
     */
    maxValue = 0;

    /**
     * An array of modifiers applied to the statistic.
     */
    modifiers: Modifier[] = [];

    constructor(baseValue = 0, minValue = 0, maxValue = 1000000) {
        this.baseValue = baseValue;
        this.totalValue = baseValue;

        this.minValue = minValue;
        this.maxValue = maxValue;
    }

    /**
     * Increases the total value of the statistic by the specified value, capped at the maximum value.
     * @param {number} value - The value to increase the statistic by.
     */
    increase(value: number) {
        this.totalValue = Math.min(this.totalValue + value, this.maxValue);
    }

    /**
     * Decreases the total value of the statistic by the specified value, capped at the minimum value.
     * @param {number} value - The value to decrease the statistic by.
     */
    decrease(value: number) {
        this.totalValue = Math.max(this.totalValue - value, this.minValue);
    }

    /**
     * Sets the total value of the statistic to the specified value, clamped between the minimum and maximum values.
     * @param {number} value - The value to set the statistic to.
     */
    set(value: number) {
        this.totalValue = Math.min(Math.max(value, this.minValue), this.maxValue);
    }

    /**
     * Resets the total value of the statistic to the base value and clears all modifiers.
     */
    reset() {
        this.totalValue = this.baseValue;
        this.modifiers = [];
    }

    /**
     * Adds a modifier or an array of modifiers to the statistic.
     * @param {Modifier | Modifier[]} modifier - The modifier(s) to add.
     */
    addModifier(modifier: Modifier | Modifier[]) {
        if (Array.isArray(modifier))
            this.modifiers.push(...modifier);
        else
            this.modifiers.push(modifier);

        this.totalValue = this.getModifiedValue();
    }

    /**
     * Removes a modifier from the statistic.
     * @param {number} originType - Type of the origin.
     * @param {number} originId - Origin ID.
     */
    removeModifier(originType: number, originId: number) {
        const index = this.modifiers.findIndex(modifier => modifier.packIdentifier(originType, originId) === modifier.uid);

        if (index !== -1)
            this.modifiers.splice(index, 1);

        this.totalValue = this.getModifiedValue();
    }

    /**
     * Returns the minimum value of the statistic.
     * @returns {number} The minimum value.
     */
    getMinValue() {
        return this.minValue;
    }

    /**
     * Returns the maximum value of the statistic.
     * @returns {number} The maximum value.
     */
    getMaxValue() {
        return this.maxValue;
    }

    /**
     * Returns the total value of the statistic.
     * @returns {number} The total value.
     */
    getTotalValue() {
        this.totalValue = this.getModifiedValue();
        return this.totalValue;
    }

    /**
     * Returns the base value of the statistic.
     * @returns {number} The base value.
     */
    getBaseValue() {
        return this.baseValue;
    }

    /**
     * Calculates the modified value of the statistic, taking into account all modifiers and caps the result at the maximum value.
     * @returns {number} The modified value of the statistic, capped at the maximum value.
     */
    getModifiedValue() {
        let modifiedValue = this.baseValue;

        for (const modifier of this.modifiers)
            modifiedValue = modifier.apply(modifiedValue);

        return Math.min(modifiedValue, this.maxValue);
    }

    /**
     * Calculates the percentage of the total value relative to the base value of the statistic.
     * @returns {number} The percentage of the total value relative to the base value, rounded to two decimal places.
     */
    getPercentage() {
        const percentage = (this.totalValue / this.baseValue) * 100;
        return Math.round(percentage * 100) / 100;
    }

    /**
     * Sets the base value of the statistic to the specified value and recalculates the total value.
     * @param {number} value - The value to set the base value to.
     */
    setBaseValue(value: number) {
        this.baseValue = value;
        this.totalValue = this.getModifiedValue();
    }

    /**
     * Returns the maximum value of the statistic.
     * @returns {number} The maximum value.
     */
    setMaxValue(value) {
        this.maxValue = value;
    }
}

/**
 * A modifier that can be applied to a statistic to change its value.
 *
 * @class
 */
class Modifier {

    type: ModifierType;
    value: number;
    duration: number | null;
    startTime: number;

    uid: number;

    /**
     * The pack method for the identifier.
     */
    packIdentifier(type: number, id: number) {
        return (type << 28) | (id & 0xfffffff);
    }

    /**
     * The unpack method for the identifier.
     */
    unpackIdentifier(value: number) {
        return {
            type: value >>> 28,
            id: value & 0xfffffff
        };
    }

    /**
     * Creates a new modifier with the given value, duration, and type.
     *
     * @param {number} value - The value of the modifier.
     * @param {string} type - The type of the modifier. Can be 0 - ADDITIVE, 1 - PERCENTUAL, 2 - MULTIPLICATOR, 3 - DIVISOR or 4 - NEGATIVE.
     * @param {number} [duration=null] - The duration of the modifier in milliseconds.
     */
    constructor(type: ModifierType, value: number, originType = -1, originId = -1, duration = null) {
        /**
         * The unique identifier of the modifier.
         * @type {number}
         */
        this.uid = this.packIdentifier(originType, originId);

        /**
         * The value of the modifier.
         * @type {number}
         */
        this.value = value;

        /**
         * The duration of the modifier, in ticks.
         * @type {number}
         */
        this.duration = duration;

        /**
         * The type of the modifier.
         * @type {string}
         */
        this.type = type;

        /**
         * The time when the modifier was applied.
         * @type {number}
         */
        this.startTime = Date.now();
    }

    /**
     * Applies the modifier to the given statistic value and returns the modified value.
     *
     * @param {number} statisticValue - The value of the statistic to modify.
     * @returns {number} - The modified value.
     */
    apply(statisticValue: number) {
        switch (this.type) {
            case ModifierType.ADDITIVE:
                return statisticValue + this.value;
            case ModifierType.NEGATIVE:
                return statisticValue - this.value;
            case ModifierType.PERCENTUAL:
                return statisticValue * (1 + this.value / 100);
            case ModifierType.MULTIPLICATOR:
                return statisticValue * this.value;
            case ModifierType.DIVISOR:
                return statisticValue / this.value;
            default:
                return statisticValue;
        }
    }
}

export { Statistic, Modifier, ModifierType, ModifierOrigin };