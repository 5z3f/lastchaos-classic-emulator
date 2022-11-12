
const EventEmitter = require('events');
const server = require("@local/shared/server");
const log = require('@local/shared/logger');
const Message = require("@local/shared/message");

const state = require("./state");

class stages {
    LOGIN = 0;
    CHARACTER_SELECT = 1;
    PLAYING = 2;
}