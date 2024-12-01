import Message from '@local/shared/message';

export default function (session) {
    return (byteString, packType) => {
        if (byteString.includes('0x'))
            byteString = byteString.replace(/0x/g, '').split(', ').map((strByte) => (strByte.length === 1) ? `0${strByte}` : strByte).join('');


        if (byteString.includes('test')) {
            const msg = new Message({ type: 43 });
            msg.write('u8', 45);
            msg.write('i32>', 7);
            msg.write('i32>', 1589247999);
            msg.write('stringnt', 'testttt');

            session.write(msg.build());
            return `CUSTOM PACKET SENT [BUFFER: ${msg.toString()}]`
        }

        const msg = new Message({ buffer: Buffer.from(byteString, 'hex'), type: Number(!!packType) });
        session.write(msg.build());

        return `CUSTOM PACKET SENT [BUFFER: ${msg.toString()}]`
    }
}
