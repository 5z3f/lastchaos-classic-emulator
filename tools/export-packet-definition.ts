import fs from 'fs';
import path from 'path';

/*
    usage: npm run tools/export-packet-definition <jsonfileName> <MessageType.h inputFilePath>
*/

function listEnums(filePath: string): string[] {
    let fileString = fs.readFileSync(filePath, 'utf8');

    // minify the string by removing all comments, spaces, and newlines
    fileString = fileString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // remove all comments
    fileString = fileString.replace(/\s+/g, ''); // remove all spaces and newlines

    const enumRegex = /typedefenum\w+\{[^}]*\}(\w+);/g;
    let enumMatch: any | never;
    const enumList = [];

    while ((enumMatch = enumRegex.exec(fileString)) !== null) {
        // @ts-ignore
        enumList.push(enumMatch[1]);
    }

    return enumList;
}

function convertEnumToJSON(filePath: string, enumAlias: string): object {
    let fileString = fs.readFileSync(filePath, 'utf8');
    
    // remove preprocessor directives
    fileString = fileString.replace(/#.*$/gm, '');

    // minify the string by removing all comments, spaces, and newlines
    fileString = fileString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // remove all comments
    fileString = fileString.replace(/\s+/g, ''); // remove all spaces and newlines

    const enumRegex = new RegExp(`typedefenum\\w+\\{([^}]*)\\}${enumAlias};`);
    const enumValuesRegex = /(\w+)(=-?\d+)?,?/g;

    const enumMatch = fileString.match(enumRegex);
    if (!enumMatch) {
        throw new Error('Invalid enum string');
    }

    const enumValuesString = enumMatch[1];
    let enumValueMatch;
    const enumJSON = {};

    let i = 0;
    while ((enumValueMatch = enumValuesRegex.exec(enumValuesString)) !== null) {
        if (enumValueMatch[2]) {
            i = parseInt(enumValueMatch[2].slice(1));
        }

        enumJSON[enumValueMatch[1]] = {
            value: i,
            hex: (i === -1) ? null : '0x' + i.toString(16).toUpperCase()
        };

        i++;
    }

    return enumJSON;
}

function exportAllEnums(fileName: string, filePath: string): void {
    const enumList = listEnums(filePath);
    const allEnumsJSON = {};

    enumList.forEach((enumAlias) => {
        const enumJSON = convertEnumToJSON(filePath, enumAlias);
        allEnumsJSON[enumAlias] = enumJSON;
    });

    fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(allEnumsJSON, null, 2));
}

const [,, fileName, outputFilePath] = process.argv;
exportAllEnums(fileName, outputFilePath);
console.log('Exported packet definition to ' + fileName + '.')
console.log(listEnums(outputFilePath))