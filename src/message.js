const SmartBuffer = require('smart-buffer').SmartBuffer;

const message =
{
    read: (reader) => {
        const header = {
            'reliable': reader.readUInt16BE(),   // ntohs
            'sequence': reader.readUInt32BE(),   // ntohl
            'clientId': reader.readUInt16BE(),
            'packetSize': reader.readUInt32BE(),
        }
        return { 'header': header, 'reader': reader };
    },
    build: (writer, clientId) => {
        const sb = new SmartBuffer();

        const writeHeader = (writer, clientId, messageSize) => {
            writer.writeUInt16BE((1 << 0) | (1 << 7) | (1 << 8));   // reliable
            writer.writeUInt32BE(0);                                // sequence
            writer.writeUInt16BE(clientId);                         // client id
            writer.writeUInt32BE(messageSize);                      // message size
        };

        writeHeader(sb, clientId, writer.length);
        return Buffer.concat([ sb.toBuffer(), writer.toBuffer() ]);
    }
}

module.exports = message;