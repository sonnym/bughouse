TMPDIR = "/tmp";

var fs = require("fs")
  , log = require("./../../src/log")
  , spawn = require("child_process").spawn
  , sys = require("sys")

// callback is given new fen
exports.move = function(fen, uuid, callback) {
  // fen input into crafty only cares about current position and move
  var crafty = spawn("crafty", ["setboard " + fen.split(" ", 2).join(" "), "sd 1", "logpath=" + TMPDIR]),
      killer_id = 0;

  crafty.stdout.on("data", function(data) {
    if (killer_id == 0) killer_id = setTimeout(function() {
      log.debug("crafty kill");

      crafty.stdin.write("move\nsavepos " + uuid + ".txt\nend\n");
    }, 5000, uuid);

  });

  crafty.on("exit", function() {
    log.debug("crafty exit");

    fs.readFile(parseInt(uuid) + ".txt", "ascii", function(err, data) {
      if (err) {
        log.debug("error");
        log.error("encountered error: " + err);
        return;
      }

      var new_fen = data.split(" ")[1];

      fs.unlink(parseInt(uuid) + ".txt"); // deletes file => stops execution

      if (callback) callback(new_fen);
    });
  });
}