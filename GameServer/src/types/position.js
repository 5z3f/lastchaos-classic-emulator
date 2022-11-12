const { Vector2 } = require('three');

class Position extends Vector2 {
    constructor(x, y, z, r, layer) {
        if(typeof x === 'object') {
            y = x.y;
            z = x.z;
            r = x.r;
            layer = x.layer;
            x = x.x;
        }
        
        super(x, y);

        this.z = z || 0.0;
        this.r = r || 0.0;
        this.layer = layer || 0;
    }

    clone() {
        return new Position(this);
    }

    static setRandomWithinRange(originalPosition, range) {
        var randomOffset = new Vector2().random().subScalar(0.5).multiplyScalar(range);
        return new Position(originalPosition).add(randomOffset);
    }

    static getRandomWithinRange(originalPosition, range) {
        return new Position(originalPosition).setRandomWithinRange(range);
    }

    setRandomWithinRange(range) {
        return this.constructor.setRandomWithinRange(this, range);
    }

    getRandomWithinRange(range) {
        return this.constructor.getRandomWithinRange(this, range);
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.z}, ${this.r}, ${this.layer})`;
    }
}

module.exports = Position;
