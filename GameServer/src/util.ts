import crypto from 'crypto';
import farmhash from 'farmhash';
import { XXHash32 } from 'xxhash-addon';

class util {
    static createSessionId() {
        //// FIXME: not sure about hash collision rate on this one, probably need to do something better
        //let randomstr = Math.random().toString(15).substring(10, 20);
        //let inthash = farmhash.hash32(randomstr + Date.now())
        //let uid = inthash / 200;

        return Math.random() * 1000000000;
    };

    static getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }

    //// github.com/rse/aggregation/blob/master/src/aggregation-es6.js
    //static extender = (base, ...mixins) => {
    //    /*  create aggregation class  */
    //    let aggregate = class __Aggregate extends base {
    //        constructor(...args) {
    //            /*  call base class constructor  */
    //            super(...args)
    //
    //            /*  call mixin's initializer  */
    //            mixins.forEach((mixin) => {
    //                if (typeof mixin.prototype.initializer === "function")
    //                    mixin.prototype.initializer.apply(this, args)
    //            })
    //        }
    //    };
    //
    //    /*  copy properties  */
    //    let copyProps = (target, source) => {
    //        Object.getOwnPropertyNames(source)
    //            .concat(Object.getOwnPropertySymbols(source))
    //            .forEach((prop) => {
    //                if (prop.match(/^(?:initializer|constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
    //                    return
    //                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
    //            })
    //    }
    //
    //    /*  copy all properties of all mixins into aggregation class  */
    //    mixins.forEach((mixin) => {
    //        copyProps(aggregate.prototype, mixin.prototype)
    //        copyProps(aggregate, mixin)
    //    })
    //
    //    return aggregate
    //}
};

export default util;
