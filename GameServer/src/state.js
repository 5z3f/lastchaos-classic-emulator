
const state = class
{
    static objects = [];
    
    static generateId = () =>
    {
        var objectsLength = this.objects.length;

        if(!objectsLength)
            return 1;

        var latestObject = this.objects[objectsLength - 1];
        return latestObject.uid + 1;
    };

    static add = (type, value) => {

        if(type == 'object')
            this.objects.push(value);
    }
}

module.exports = state;