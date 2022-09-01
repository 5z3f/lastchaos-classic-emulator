const farmhash = require('farmhash');

const state = class
{
    static objects = [];
    
    static generateId = () =>
    {
        var objectsLength = this.objects.length;

        if(!objectsLength)
            return 1;

        var latestObject = this.objects[objectsLength - 1];

        // FIXME: not sure about hash collision rate on this one, probably need to do something better
        var randomstr = Math.random().toString(15).substring(10, 20);
        var inthash = farmhash.hash32(randomstr + Date.now() + String(latestObject.uid + 1))
        var uid = parseInt(inthash / 200);

        return uid;
    };

    static add = (type, value) => {

        if(type == 'object')
            this.objects.push(value);
    }
}

module.exports = state;