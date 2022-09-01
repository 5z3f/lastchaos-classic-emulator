const server = require("@local/shared/server");

var srv = new server({
    host:       '127.0.0.1',
    port:       4191,
    handlers:   require("./handlers"),
    senders:    require("./senders")
});