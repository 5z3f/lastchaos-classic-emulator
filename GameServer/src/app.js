const server = require("@local/shared/server");
const handler = require("./handler");

HOST = '127.0.0.1';
PORT = 4190;

server.mount(HOST, PORT, handler);