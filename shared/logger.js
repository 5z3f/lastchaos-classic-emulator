const chalk = require('chalk');

const log = {
    info: (message) => {
        const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(`${ chalk.gray(ts) } :: ${ chalk.blueBright(message) }`)
    },
    data: (data) => {
        const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(`${ chalk.gray(ts) } :: ${ chalk.italic(data) }`);
    },
    debug: (data) => {
        const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(`${ chalk.gray(ts) } :: ${ chalk.italic.yellowBright(data) }`);
    }
}

module.exports = log;