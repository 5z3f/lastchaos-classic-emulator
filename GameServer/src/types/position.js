
const Position = class
{
    constructor(x, z, h, r, y)
    {
        this.x = x || 0.0;
        this.z = z || 0.0;
        this.h = h || 0.0;
        this.r = r || 0.0;
        this.y = y || 0;
    }
}

module.exports = Position;