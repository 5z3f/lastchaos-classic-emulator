const SmartBuffer = require('smart-buffer').SmartBuffer;

const message = class
{
    /**
     * Constructor
     * @param {Buffer} buffer initialize from given `Buffer` object
     * @param {number} type write message type
     * @param {number} subType write message subtype
     * @param {Boolean} [header=true] read lc packet header?
     */
    constructor({ buffer, type, subType, header })
    {
        this._sb = buffer ? SmartBuffer.fromBuffer(buffer) : new SmartBuffer();

        this.header = (header !== false && this._sb.length >= 12) ? { // 12 - header length
            'reliable': this.read('u16>'),                  // ntohs
            'sequence': this.read('u32>'),                  // ntohl
            'clientId': this.read('u16>'),
            'packetSize': this.read('u32>'),
        } : null;

        if(type)     this.write('u8', type);
        if(subType)  this.write('u8', subType);
    }

    /**
     * Get Buffer object
     * @return {Buffer} buffer
     */
    buffer = () => this._sb.toBuffer();

    /**
     * Build message and export it to `Buffer` object
     * @param {number} clientId client id
     * @param {Boolean} [header=true] write lc packet header?
     * @return {Buffer} `Buffer` object
     */
    build = ({ clientId, header }) => {

        const makeHeader = (clientId, messageSize) =>
        {
            var writer = new SmartBuffer();

            writer.writeUInt16BE((1 << 0) | (1 << 7) | (1 << 8));   // reliable
            writer.writeUInt32BE(0);                                // sequence
            writer.writeUInt16BE(clientId);                         // client id
            writer.writeUInt32BE(messageSize);                      // message size

            return writer;
        };

        return header === false
            ? this._sb.toBuffer()
            : Buffer.concat([ makeHeader(clientId, this._sb.length).toBuffer(), this._sb.toBuffer() ]);
    }

    /**
     * Available types: \
     * i8, u8, stringnt, i16, u16, i32, u32, i64, u64, f (float) \
     * you can set endian by using '>' (big) or '<' (little) at the end of type
     * @param {string} type
     * @return {value} value
     */
    read = (type) =>
    {
        var val;

        switch(type)
        {
            case 'i8':          val = this._sb.readInt8(); break;
            case 'u8':          val = this._sb.readUInt8(); break;
            case 'stringnt':    val = this._sb.readStringNT(val); break;
            case 'i16<':        val = this._sb.readInt16LE(); break;
            case 'i16>':        val = this._sb.readInt16BE(); break;
            case 'u16<':        val = this._sb.readUInt16LE(); break;
            case 'u16>':        val = this._sb.readUInt16BE(); break;
            case 'i32<':        val = this._sb.readInt32LE(); break;
            case 'i32>':        val = this._sb.readInt32BE(); break;
            case 'u32<':        val = this._sb.readUInt32LE(); break;
            case 'u32>':        val = this._sb.readUInt32BE(); break;
            case 'i64<':        val = this._sb.readBigInt64LE(); break;
            case 'i64>':        val = this._sb.readBigInt64BE(); break;
            case 'u64<':        val = this._sb.readBigUInt64LE(); break;
            case 'u64>':        val = this._sb.readBigUInt64BE(); break;
            case 'f<':          val = this._sb.readFloatLE(); break;
            case 'f>':          val = this._sb.readFloatBE(); break;
        }

        return val;
    }

    /**
     * Available types: \
     * i8, u8, stringnt, i16, u16, i32, u32, i64, u64, f (float) \
     * you can set endian by using '>' (big) or '<' (little) at the end of type
     * @param {string} type type
     * @param {value} val value
     */
    write = (type, val) =>
    {
        switch(type)
        {
            case 'i8':          this._sb.writeInt8(val); break;
            case 'u8':          this._sb.writeUInt8(val); break;
            case 'stringnt':    this._sb.writeStringNT(val); break;
            case 'i16<':        this._sb.writeInt16LE(val); break;
            case 'i16>':        this._sb.writeInt16BE(val); break;
            case 'u16<':        this._sb.writeUInt16LE(val); break;
            case 'u16>':        this._sb.writeUInt16BE(val); break;
            case 'i32<':        this._sb.writeInt32LE(val); break;
            case 'i32>':        this._sb.writeInt32BE(val); break;
            case 'u32<':        this._sb.writeUInt32LE(val); break;
            case 'u32>':        this._sb.writeUInt32BE(val); break;
            case 'i64<':        this._sb.writeBigInt64LE(BigInt(val)); break;
            case 'i64>':        this._sb.writeBigInt64BE(BigInt(val)); break;
            case 'u64<':        this._sb.writeBigUInt64LE(BigInt(val)); break;
            case 'u64>':        this._sb.writeBigUInt64BE(BigInt(val)); break;
            case 'f<':          this._sb.writeFloatLE(val); break;
            case 'f>':          this._sb.writeFloatBE(val); break;
        }
    }
};

module.exports = message;