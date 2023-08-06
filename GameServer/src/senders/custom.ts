import log from '@local/shared/logger';
import Message from '@local/shared/message';
import _messages from './_messages.json';

export default function (session) {
    return (byteString, packType) => {
        if (byteString.includes('0x'))
            byteString = byteString.replace(/0x/g, '').split(', ').map((strByte) => (strByte.length === 1) ? `0${strByte}` : strByte).join('');

        let msg = new Message({ buffer: Buffer.from(byteString, 'hex'), type: Number(!!packType) });
        session.write(msg.build());

        return `CUSTOM PACKET SENT [BUFFER: ${msg.toString()}]`
    }
}
