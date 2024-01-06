const repl = require('repl');
const tsNode = require('ts-node');

tsNode.register();
require('../GameServer/src/main');
const replServer = repl.start({});

// assign app into REPL context
replServer.context.app = global.app;

/*
    or we can do it manually like this so the vscode debugger will have access to the app context aswell (my preferred way):

    > ts-node
    > require('./GameServer/src/main');
*/