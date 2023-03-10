const fs = require('fs');
const chalk = require('chalk');

function writeToLogFile(message) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const filePath = `./logs/log_${year}${month}${day}.txt`;

    fs.appendFile(filePath, message + '\n', (err) => {
        if (err) throw err;
    });
}

const log = {
    info: (message) => {
        const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(`${chalk.gray(ts)} :: ${chalk.blueBright(message)}`);
        writeToLogFile(`${ts} :: INFO :: ${message}`);
    },
    data: (message) => {
        const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(`${chalk.gray(ts)} :: ${chalk.italic(message)}`);
        writeToLogFile(`${ts} :: DATA :: ${message}`);
    },
    debug: (message) => {
        const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(`${chalk.gray(ts)} :: ${chalk.italic.yellowBright(message)}`);
        writeToLogFile(`${ts} :: DEBUG :: ${message}`);
    },
    error: (message) => {
        const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        console.error(`${chalk.gray(ts)} :: ${chalk.redBright('ERROR:')} ${chalk.whiteBright((message instanceof Error) ? message.stack : message)}`);
        writeToLogFile(`${ts} :: ERROR :: ${(message instanceof Error) ? message.stack : message}`);
    }
}

module.exports = log;