const server = require("@local/shared/server");
const handler = require("./handler");

server.mount('127.0.0.1', 4191, handler);
