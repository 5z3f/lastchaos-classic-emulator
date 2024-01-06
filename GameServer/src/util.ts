import crypto from 'crypto';

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

    static durationToSeconds(duration: string): number {
        const timeUnits = {
            'second': 1,
            'minute': 60,
            'hour': 3600,
            'day': 86400,
            'week': 604800,
            'month': 2592000
        };
    
        let totalSeconds = 0;
        const regex = /(\d+)\s*(second|minute|hour|day|week|month)s?/g;
        let match;
    
        while ((match = regex.exec(duration)) !== null) {
            let value = parseInt(match[1]);
            let unit = match[2];
            totalSeconds += value * timeUnits[unit];
        }
    
        return totalSeconds;
    }
}

export default util;
