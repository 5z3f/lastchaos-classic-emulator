# How to use the Statistic class

The Statistic class is used to represent a game statistic, such as health or strength. It provides methods for increasing and decreasing the statistic value, applying modifiers, and getting the modified value.

To create a new statistic, you can instantiate the Statistic class with the base value, minimum value, and maximum value:

```js
const health = new Statistic(100, 0, 200);
```

This creates a new health statistic with a base value of 100, a minimum value of 0, and a maximum value of 200.

## Modifying the current statistic value (not recommended, use modifiers)

To modify the value of the statistic, you can use the `increase()`, `decrease()`, and `set()` methods:

```js
health.increase(20); // increases the health by 20, capped at the maximum value of 200
health.decrease(30); // decreases the health by 30, capped at the minimum value of 0
health.set(150); // sets the health to 150, clamped between the minimum and maximum values of 0 and 200
```

You can also get the current value of the statistic using the `getCurrentValue()` method:

```js
const currentHealth = health.getCurrentValue();
```

## Adding and removing modifiers

To add a modifier to the statistic, you can use the `addModifier()` method:

```js
const bonusHealth = new Modifier(ModifierType.ADDITIVE, 20);
health.addModifier(bonusHealth); // adds a modifier that increases the health by 20

// or you can also add Origin to identify it later

const buffId = 958;
const bonusAttack = new Modifier(ModifierType.ADDITIVE, 80, ModifierOrigin.BUFF, buffId);
attack.addModifier(bonusAttack); // adds a modifier that increases the attack by 80
```
You can remove a modifier from the statistic using the `removeModifier()` method:

```js
const buffId = 958;
health.removeModifier(ModifierOrigin.BUFF, buffId); // removes the bonus attack buff modifier
```

## Resetting the statistic

To reset the statistic to its base value and remove all modifiers, you can use the `reset()` method:

```js
health.reset(); // resets the health to its base value and removes all modifiers
```

## Getting the minimum, maximum and base values

To get the minimum, maximum and base value of the statistic, you can use the `getMinValue()`, `getMaxValue()` and `getBaseValue()` methods:

```js
const minValue = health.getMinValue();
const maxValue = health.getMaxValue();
const maxValue = health.getBaseValue();
```

## Getting the percentage

To get the percentage of the current value relative to the minimum and maximum values, you can use the `getPercentage()` method:

```js
const percentage = health.getPercentage();
```