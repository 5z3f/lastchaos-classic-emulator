import crypto from 'crypto';
import farmhash from 'farmhash';
import { XXHash32 } from 'xxhash-addon';

class util {
    static createSessionId() {
        // Generate a random buffer
        const buffer = crypto.randomBytes(4);

        // Convert the buffer to a 32-bit signed integer
        const id = buffer.readInt32BE(0);

        return Math.abs(id);
    }

    static getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }
}

export default util;
