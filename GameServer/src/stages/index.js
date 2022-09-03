
const EventEmitter = require('events');
const server = require("@local/shared/server");
const log = require('@local/shared/logger');
const message = require("@local/shared/message");

const state = require("./state");

const stages = class
{
    LOGIN = 0;
    CHARACTER_SELECT = 1;
    PLAYING = 2;
}