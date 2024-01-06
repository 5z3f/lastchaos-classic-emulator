import * as fs from 'fs';
import * as path from 'path';

/*
    usage: npm run tools/convert-packet-dump <packetDefinitionsFilePath> <packetDumpFilePath>
*/

function getSubtype(type: string): string | null {
    return Object.keys(packetDefinitions).find(key => key.startsWith(type + '_')) || null;
}

function getStringEquivalent(hexValue: string, nextHexValue?: string): string[] {
    const entries = Object.entries(packetDefinitions.MESSAGETYPE);
    const foundEntry = entries.find(([key, value]) => (value as { hex: string }).hex.toLowerCase() === hexValue);

    if (!foundEntry) return [hexValue];

    const [key] = foundEntry;
    const subtypeKey = getSubtype(key);

    let asciiRepresentation: string | undefined;
    const hasAsciiRepresentation = nextHexValue?.includes(' | ');
    
    if(hasAsciiRepresentation) {
        asciiRepresentation = nextHexValue?.split(' | ')[1];
        nextHexValue = nextHexValue?.split(' | ')[0];
    }

    if (nextHexValue && subtypeKey) {
        const subtypeValue = packetDefinitions[subtypeKey] as { [key: string]: { hex: string } };
        const foundSubtype = Object.entries(subtypeValue).find(([subTypeKey, subTypeValue]) => subTypeValue.hex === nextHexValue);

        if (foundSubtype)
            return [key, hasAsciiRepresentation ? foundSubtype[0] + ' | ' + asciiRepresentation : foundSubtype[0]];
    }

    return [key];
}

function replaceHexValues(line: string): string {
    const [prefix, hexValues] = line.split('bytes: ');

    if (!hexValues) return line;

    const hexArray = hexValues.split(', ');
    // FIXME: MSG_MOVE packet has subType in the 3rd byte, this is not handled here
    const [type, subType] = getStringEquivalent(hexArray[0], hexArray[1]);

    hexArray[0] = type;
    if (subType) hexArray[1] = subType;

    return `${prefix}bytes: ${hexArray.join(', ')}`;
}

const [,, packetDefinitionsFilePath, packetLogFilePath] = process.argv;
const packetDefinitions = JSON.parse(fs.readFileSync(packetDefinitionsFilePath, 'utf8'));

const fileContent = fs.readFileSync(packetLogFilePath, 'utf-8');
const lines = fileContent.split('\n');
const replacedLines = lines.map(replaceHexValues);
const replacedContent = replacedLines.join('\n');

const directoryPath = path.dirname(packetLogFilePath);
const baseName = path.basename(packetLogFilePath);
const newBaseName = `${baseName}(defined)`;
const outputFilePath = path.join(directoryPath, newBaseName + '.txt');

fs.writeFileSync(outputFilePath, replacedContent);

console.log('Exported packets with defined types to ' + outputFilePath + '.');