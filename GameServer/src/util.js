const farmhash = require('farmhash');

const util = class
{
    static generateId = () =>
    {
        // FIXME: not sure about hash collision rate on this one, probably need to do something better
        var randomstr = Math.random().toString(15).substring(10, 20);
        var inthash = farmhash.hash32(randomstr + Date.now())
        var uid = parseInt(inthash / 200);

        return uid;
    };
};

module.exports = util;