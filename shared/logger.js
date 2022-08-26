const chalk = require('chalk');
const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

const log = {
    info: (message) => {
        console.log(`${ chalk.gray(ts) } :: ${ chalk.blueBright(message) }`)
    },
    data: (data) => {
        console.log(`${ chalk.gray(ts) } :: ${ chalk.italic(data) }`);
    }
}

module.exports = log;